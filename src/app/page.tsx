import { PublicPageClient } from '@/app/PublicPageClient';
import { loadLoadingSectionData } from '@/app/invitationData';

// 60초 동안 캐싱하여 불필요한 DB 조회 방지
export const revalidate = 60;

/**
 * 퍼블릭 페이지 (DB 연동)
 * LoadingSection에 필요한 최소 데이터만 조회 → TTFB 단축
 * 나머지 데이터는 PublicPageClient가 /api/invitation으로 클라이언트 fetch
 * @returns JSX.Element
 */
export default async function Page() {
  const loadingData = await loadLoadingSectionData();

  return <PublicPageClient loadingData={loadingData} />;
}
