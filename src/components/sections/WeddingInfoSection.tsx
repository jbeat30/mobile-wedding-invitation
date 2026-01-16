import { invitationMock } from '@/mock/invitation.mock';
import { IntroCalendar } from '@/components/sections/IntroCalendar';
import { DDayCountdown } from '@/components/sections/DDayCountdown';

/**
 * 예식 일시 섹션
 */
export const WeddingInfoSection = () => {
  const { weddingDateTime, info } = invitationMock;

  return (
    <section id="wedding-info" className="bg-[var(--bg-primary)] py-16">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <span className="font-label text-[13px] text-[var(--accent-rose)]">WEDDING DAY</span>
          <h2 className="mt-2 text-[24px] font-medium text-[var(--text-primary)]">
            {info.title}
          </h2>
        </div>

        {/* 날짜/시간 */}
        <div className="text-center" data-animate="fade-up">
          <p className="text-[18px] leading-relaxed text-[var(--text-secondary)]">
            {info.dateText}
          </p>
        </div>

        {/* 달력 */}
        <div data-animate="scale">
          <IntroCalendar
            weddingDateTime={weddingDateTime}
            highlightDates={[16]}
          />
        </div>

        {/* D-Day 카운트다운 */}
        <DDayCountdown weddingDateTime={weddingDateTime} />

        {/* 결혼 메시지 */}
        <div className="py-8" data-animate="fade-up">
          <div className="flex items-center justify-center text-[0.875em] leading-snug">
            강신랑
            <span className="mx-1">
              <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.88721 5.6442L5.23558 9.85513C5.50241 10.1135 5.92616 10.1135 6.19299 9.85513L10.5414 5.6442C11.1084 5.09504 11.4286 4.33939 11.4286 3.54999C11.4286 1.93996 10.1234 0.634766 8.51334 0.634766H8.37789C7.58576 0.634766 6.82469 0.942878 6.25565 1.49393L5.74766 1.98587C5.72906 2.00388 5.69951 2.00388 5.68091 1.98587L5.17292 1.49393C4.60388 0.942878 3.84281 0.634766 3.05068 0.634766H2.91523C1.30519 0.634766 0 1.93996 0 3.54999C0 4.33939 0.320132 5.09504 0.88721 5.6442Z" fill="black"></path>
              </svg>
            </span>
            장신부 결혼식이{' '}
            <span className="mx-1 text-[var(--accent-burgundy)]">
              {Math.ceil((new Date(weddingDateTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}일
            </span>
            남았습니다
          </div>
        </div>
      </div>
    </section>
  );
};
