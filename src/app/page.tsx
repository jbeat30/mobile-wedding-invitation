import { PublicPageClient } from '@/app/PublicPageClient';
import { loadInvitationView } from '@/app/invitationData';

// 60초 동안 캐싱하여 불필요한 DB 조회 방지
export const revalidate = 60;

/**
 * 퍼블릭 페이지 (DB 연동)
 * @returns JSX.Element
 */
export default async function Page() {
  const invitation = await loadInvitationView();

  return <PublicPageClient invitation={invitation} />;
}
