import sharp from 'sharp';

const QUALITY_STEPS = [85, 75, 65, 55, 45];
const SCALE_STEPS = [1, 0.85, 0.7, 0.55];

type CompressedImage = {
  buffer: Uint8Array;
  contentType: string;
  extension: string;
  size: number;
};

const getFormatOrder = (format?: string | null) => {
  switch (format) {
    case 'png':
      return ['png', 'webp', 'jpeg'] as const;
    case 'webp':
      return ['webp', 'jpeg'] as const;
    case 'jpeg':
    case 'jpg':
      return ['jpeg', 'webp'] as const;
    default:
      return ['jpeg', 'webp'] as const;
  }
};

const getExtension = (format: string) => {
  switch (format) {
    case 'png':
      return 'png';
    case 'webp':
      return 'webp';
    case 'jpeg':
    case 'jpg':
    default:
      return 'jpg';
  }
};

const getContentType = (format: string) => {
  switch (format) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'jpeg':
    case 'jpg':
    default:
      return 'image/jpeg';
  }
};

const getBaseName = (filename: string) => {
  const lastDot = filename.lastIndexOf('.');
  return lastDot > 0 ? filename.slice(0, lastDot) : filename;
};

const encodeImage = async ({
  input,
  format,
  quality,
  resizeWidth,
}: {
  input: Buffer;
  format: string;
  quality: number;
  resizeWidth?: number;
}): Promise<CompressedImage> => {
  let pipeline = sharp(input, { failOnError: false }).rotate();
  if (resizeWidth) {
    pipeline = pipeline.resize({ width: resizeWidth, withoutEnlargement: true });
  }

  switch (format) {
    case 'png':
      pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'jpeg':
    default:
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      break;
  }

  const buffer = await pipeline.toBuffer();
  const output = new Uint8Array(buffer);
  return {
    buffer: output,
    contentType: getContentType(format),
    extension: getExtension(format),
    size: output.byteLength,
  };
};

const toArrayBuffer = (data: Uint8Array) =>
  data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;

export const compressImageFile = async ({
  file,
  maxBytes,
}: {
  file: File;
  maxBytes: number;
}): Promise<{ file: File; changed: boolean }> => {
  if (!file.type.startsWith('image/')) {
    return { file, changed: false };
  }

  const originalBuffer = Buffer.from(await file.arrayBuffer());
  if (originalBuffer.byteLength <= maxBytes) {
    return { file, changed: false };
  }

  const metadata = await sharp(originalBuffer, { failOnError: false }).metadata();
  const baseName = getBaseName(file.name || 'upload');
  const formatOrder = getFormatOrder(metadata.format);
  const width = metadata.width ?? null;

  let best: CompressedImage | null = null;

  for (const scale of SCALE_STEPS) {
    const resizeWidth = width ? Math.max(1, Math.round(width * scale)) : undefined;
    for (const format of formatOrder) {
      for (const quality of QUALITY_STEPS) {
        const candidate = await encodeImage({
          input: originalBuffer,
          format,
          quality,
          resizeWidth,
        });
        if (!best || candidate.size < best.size) {
          best = candidate;
        }
        if (candidate.size <= maxBytes) {
          const nextName = `${baseName}.${candidate.extension}`;
          return {
            file: new File([toArrayBuffer(candidate.buffer)], nextName, {
              type: candidate.contentType,
            }),
            changed: true,
          };
        }
      }
    }
  }

  if (!best || best.size > maxBytes) {
    throw new Error('unable to compress image below size limit');
  }

  const fallbackName = `${baseName}.${best.extension}`;
  return {
    file: new File([toArrayBuffer(best.buffer)], fallbackName, { type: best.contentType }),
    changed: true,
  };
};
