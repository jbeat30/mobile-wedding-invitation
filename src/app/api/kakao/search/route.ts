import { NextResponse } from 'next/server';

type KakaoSearchResult = {
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string; // 경도 (longitude)
  y: string; // 위도 (latitude)
  category_name: string;
  id: string;
};

type KakaoSearchResponse = {
  documents: KakaoSearchResult[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
};

/**
 * 카카오 키워드 검색 API
 * @param req Request
 * @returns Promise<Response>
 */
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: '검색어가 필요합니다' }, { status: 400 });
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'KAKAO_REST_API_KEY is not defined' }, { status: 500 });
  }

  try {
    const url = new URL('https://dapi.kakao.com/v2/local/search/keyword.json');
    url.searchParams.set('query', query);
    url.searchParams.set('size', '10'); // 최대 10개 결과

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `카카오 API 오류: HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const data = (await response.json()) as KakaoSearchResponse;

    // 결과를 우리가 사용하기 쉬운 형태로 변환
    const results = data.documents.map((doc) => ({
      id: doc.id,
      placeName: doc.place_name,
      address: doc.address_name,
      roadAddress: doc.road_address_name,
      latitude: parseFloat(doc.y),
      longitude: parseFloat(doc.x),
      category: doc.category_name,
    }));

    return NextResponse.json({
      results,
      totalCount: data.meta.total_count,
    });
  } catch (error) {
    console.error('Kakao search error:', error);
    return NextResponse.json({ error: '검색 중 오류가 발생했습니다' }, { status: 500 });
  }
};
