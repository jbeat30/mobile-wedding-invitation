import crypto from 'crypto';

/**
 * R2 환경 변수를 읽어 설정 구성
 * @returns { endpoint: URL, bucket: string, accessKeyId: string, secretAccessKey: string, publicBaseUrl: string, region: string }
 */
const getR2Config = () => {
  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET_NAME;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey || !publicBaseUrl) {
    throw new Error('R2 env is missing');
  }

  return {
    endpoint: new URL(endpoint),
    bucket,
    accessKeyId,
    secretAccessKey,
    publicBaseUrl: publicBaseUrl.replace(/\/$/, ''),
    region: 'auto',
  };
};

/**
 * SHA256 해시 생성
 * @param value string | Buffer | Uint8Array
 * @returns string
 */
const hashSha256 = (value: string | Buffer | Uint8Array) =>
  crypto.createHash('sha256').update(value).digest('hex');

/**
 * HMAC SHA256 서명 생성
 * @param key Buffer | string
 * @param value string
 * @returns Buffer
 */
const hmacSha256 = (key: Buffer | string, value: string) =>
  crypto.createHmac('sha256', key).update(value).digest();

/**
 * AWS 서명용 날짜(yyyyMMdd'T'HHmmss'Z') 포맷
 * @param date Date
 * @returns string
 */
const toAmzDate = (date: Date) =>
  date
    .toISOString()
    .replace(/[:-]|\.\d{3}/g, '');

/**
 * AWS 서명용 날짜(yyyyMMdd) 포맷
 * @param date Date
 * @returns string
 */
const toDateStamp = (date: Date) => date.toISOString().slice(0, 10).replace(/-/g, '');

/**
 * S3 경로용 인코딩
 * @param value string
 * @returns string
 */
const encodePath = (value: string) =>
  value
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');

type SignedRequest = {
  url: string;
  headers: Record<string, string>;
};

/**
 * R2 서명 요청 생성
 * @param params { method: string, key: string, contentType?: string, payloadHash: string, copySource?: string }
 * @returns SignedRequest
 */
const signRequest = ({
  method,
  key,
  contentType,
  payloadHash,
  copySource,
}: {
  method: string;
  key: string;
  contentType?: string;
  payloadHash: string;
  copySource?: string;
}): SignedRequest => {
  const config = getR2Config();
  const now = new Date();
  const amzDate = toAmzDate(now);
  const dateStamp = toDateStamp(now);
  const host = config.endpoint.host;

  const canonicalUri = `/${config.bucket}/${encodePath(key)}`;

  // AWS4 서명에서 canonical headers와 signed headers는 알파벳 순으로 정렬되어야 함
  const headerPairs: Array<{ name: string; value: string }> = [
    { name: 'host', value: host },
    { name: 'x-amz-content-sha256', value: payloadHash },
    { name: 'x-amz-date', value: amzDate },
  ];

  if (contentType) {
    headerPairs.push({ name: 'content-type', value: contentType });
  }
  if (copySource) {
    headerPairs.push({ name: 'x-amz-copy-source', value: copySource });
  }

  // 알파벳 순 정렬
  headerPairs.sort((a, b) => a.name.localeCompare(b.name));

  const canonicalHeaders = headerPairs.map((h) => `${h.name}:${h.value}`);
  const signedHeadersList = headerPairs.map((h) => h.name);

  const canonicalRequest = [
    method,
    canonicalUri,
    '',
    `${canonicalHeaders.join('\n')}\n`,
    signedHeadersList.join(';'),
    payloadHash,
  ].join('\n');

  const scope = `${dateStamp}/${config.region}/s3/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    scope,
    hashSha256(canonicalRequest),
  ].join('\n');

  const kDate = hmacSha256(`AWS4${config.secretAccessKey}`, dateStamp);
  const kRegion = hmacSha256(kDate, config.region);
  const kService = hmacSha256(kRegion, 's3');
  const kSigning = hmacSha256(kService, 'aws4_request');
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  const headers: Record<string, string> = {
    Host: host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
    Authorization: `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${scope}, SignedHeaders=${signedHeadersList.join(
      ';'
    )}, Signature=${signature}`,
  };

  if (copySource) {
    headers['x-amz-copy-source'] = copySource;
  }
  if (contentType) {
    headers['content-type'] = contentType;
  }

  return {
    url: `${config.endpoint.origin}${canonicalUri}`,
    headers,
  };
};

/**
 * R2 API 호출
 * @param params { method: string, key: string, body?: Uint8Array, contentType?: string, copySource?: string }
 * @returns Promise<Response>
 */
const requestR2 = async ({
  method,
  key,
  body,
  contentType,
  copySource,
}: {
  method: string;
  key: string;
  body?: Uint8Array;
  contentType?: string;
  copySource?: string;
}) => {
  const payloadHash = hashSha256(body ?? '');
  const { url, headers } = signRequest({ method, key, contentType, payloadHash, copySource });

  return fetch(url, {
    method,
    headers,
    body: body ? Buffer.from(body) : undefined,
  });
};

/**
 * 파일명 정리
 * @param name string
 * @returns string
 */
const sanitizeFilename = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '_');

type UploadResult = {
  url: string;
  key: string;
  uuid: string;
  originalName: string;
};

/**
 * R2 업로드 (tmp -> invitations/{sectionId} 이동)
 * @param params { sectionId: string, file: File }
 * @returns Promise<UploadResult>
 */
export const uploadToR2 = async ({
  sectionId,
  file,
}: {
  sectionId: string;
  file: File;
}): Promise<UploadResult> => {
  const config = getR2Config();
  const uuid = crypto.randomUUID();
  const originalName = sanitizeFilename(file.name || 'upload');
  const extension = originalName.includes('.')
    ? originalName.slice(originalName.lastIndexOf('.'))
    : '';
  const filename = `${uuid}${extension}`;
  const tmpKey = `tmp/${filename}`;
  const finalKey = `invitations/${sectionId}/${filename}`;

  const buffer = new Uint8Array(await file.arrayBuffer());
  const contentType = file.type || undefined;

  const uploadResponse = await requestR2({
    method: 'PUT',
    key: tmpKey,
    body: buffer,
    contentType,
  });

  if (!uploadResponse.ok) {
    throw new Error('R2 upload failed');
  }

  const copySource = `/${config.bucket}/${encodePath(tmpKey)}`;
  const copyResponse = await requestR2({
    method: 'PUT',
    key: finalKey,
    copySource,
  });

  if (!copyResponse.ok) {
    throw new Error('R2 copy failed');
  }

  const deleteResponse = await requestR2({
    method: 'DELETE',
    key: tmpKey,
  });

  if (!deleteResponse.ok) {
    throw new Error('R2 tmp cleanup failed');
  }

  return {
    url: `${config.publicBaseUrl}/${finalKey}`,
    key: finalKey,
    uuid,
    originalName,
  };
};
