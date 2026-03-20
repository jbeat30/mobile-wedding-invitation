import { NextResponse } from 'next/server';
import { loadInvitationView } from '@/app/invitationData';

// layout.tsx / page.tsx와 동일한 ISR 캐시 주기 (60초)
export const revalidate = 60;

/**
 * 청첩장 전체 데이터 API
 * PublicPageClient가 LoadingSection 표시 후 전체 데이터를 클라이언트 fetch로 수신
 */
export async function GET() {
  const invitation = await loadInvitationView();
  return NextResponse.json(invitation);
}
