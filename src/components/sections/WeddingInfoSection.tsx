import type { InvitationCouple, InvitationEvent } from '@/mock/invitation.mock';
import { IntroCalendar } from '@/components/sections/IntroCalendar';
import { DDayCountdown } from '@/components/sections/DDayCountdown';
import { SectionHeader } from '@/components/ui/SectionHeader';

type WeddingInfoSectionProps = {
  event: InvitationEvent;
  couple: InvitationCouple;
  title: string;
};

/**
 * 예식 일시 섹션
 */
export const WeddingInfoSection = ({ event, couple, title }: WeddingInfoSectionProps) => {
  const weddingDate = new Date(event.dateTime);
  const highlightDates = Number.isNaN(weddingDate.getTime()) ? [] : [weddingDate.getDate()];
  const formattedDateTime = Number.isNaN(weddingDate.getTime())
    ? event.dateTime
    : `${new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }).format(weddingDate)} ${new Intl.DateTimeFormat('ko-KR', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(weddingDate)}`;

  return (
    <section id="wedding-info" className="bg-[var(--bg-primary)] py-12">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-6 px-6">
        {/* 섹션 헤더 */}
        <div
          className="text-center"
          data-animate="fade-up"
          data-animate-start="80"
          data-animate-trigger="section"
        >
          <SectionHeader
            kicker="WEDDING DAY"
            title={title}
            kickerClassName="font-label text-[14px] text-[var(--accent-rose)]"
            titleClassName="mt-2 text-[24px] font-medium text-[var(--text-primary)]"
          />
        </div>

        {/* 날짜/시간 */}
        <div className="text-center" data-animate="fade-up" data-animate-start="80">
          <p className="text-[18px] leading-relaxed text-[var(--text-secondary)]">
            {formattedDateTime}
          </p>
        </div>

        {/* 달력 */}
        <div data-animate="scale" data-animate-start="80">
          <IntroCalendar
            weddingDateTime={event.dateTime}
            highlightDates={highlightDates}
          />
        </div>

        {/* D-Day 카운트다운 */}
        <DDayCountdown weddingDateTime={event.dateTime} couple={couple} />
      </div>
    </section>
  );
};
