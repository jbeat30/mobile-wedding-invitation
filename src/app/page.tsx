import { PublicPageClient } from '@/app/PublicPageClient';
import { loadInvitationView } from '@/app/invitationData';

export const dynamic = 'force-dynamic';

/**
 * 퍼블릭 페이지 (DB 연동)
 * @returns JSX.Element
 */
export default async function Page() {
  const invitation = await loadInvitationView();

  return <PublicPageClient invitation={invitation} />;
}
