import { NextResponse } from 'next/server';

const fetchCoordinates = async (address: string, apiKey: string) => {
  const url = new URL('https://dapi.kakao.com/v2/local/search/address.json');
  url.searchParams.set('query', address);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `KakaoAK ${apiKey}`,
    },
    cache: 'no-store',
  });
  if (!response.ok) {
    return { coords: null, status: 'HTTP_ERROR', message: `HTTP ${response.status}` };
  }
  const data = (await response.json()) as {
    documents?: Array<{ x?: string; y?: string }>;
  };
  const doc = data?.documents?.[0];
  const lng = Number(doc?.x);
  const lat = Number(doc?.y);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { coords: null, status: 'NO_POINT', message: '좌표 없음' };
  }
  return { coords: { lat, lng }, status: 'OK', message: '' };
};

/**
 * 주소 기반 좌표 조회
 * @param req Request
 * @returns Promise<Response>
 */
export const POST = async (req: Request) => {
  const { address } = (await req.json()) as { address?: string };
  if (!address) {
    return NextResponse.json({ error: '주소가 필요합니다' }, { status: 400 });
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'KAKAO_REST_API_KEY is not defined' }, { status: 500 });
  }

  const result = await fetchCoordinates(address, apiKey);
  if (result.coords) {
    return NextResponse.json(result.coords);
  }
  return NextResponse.json(
    {
      error: '좌표 결과 없음',
      status: result.status,
      message: result.message,
    },
    { status: 404 }
  );
};
