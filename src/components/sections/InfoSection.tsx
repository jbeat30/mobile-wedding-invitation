import { invitationMock } from '@/mock/invitation.mock';

/**
 * 예식 정보 섹션 구성 확인
 */
export const InfoSection = () => {
  const { info, couple } = invitationMock;

  return (
    <section
      id="info"
      className="relative overflow-hidden bg-[var(--bg-primary)] text-[var(--text-dark)]"
    >
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6 py-16">
        <div className="flex flex-col gap-4 text-center" data-animate="fade-up">
          <span className="text-[11px] tracking-[0.4em] text-[var(--muted)]">WEDDING DAY</span>
          <h2 className="text-[28px] font-semibold text-[var(--text-primary)]">
            {info.title}
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)]">
            {couple.groom.displayName} · {couple.bride.displayName}
          </p>
        </div>

        <div
          className="rounded-[var(--radius-lg)] border border-white/70 bg-white/90 p-6 shadow-[var(--shadow-soft)] backdrop-blur"
          data-animate="fade-up"
        >
          <div className="grid gap-6 text-[15px] text-[var(--text-primary)]">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] tracking-[0.35em] text-[var(--muted)]">WHEN</span>
              <p className="text-[18px] font-semibold">{info.dateText}</p>
            </div>
            <div className="h-px w-full bg-black/5" />
            <div className="flex flex-col gap-2">
              <span className="text-[11px] tracking-[0.35em] text-[var(--muted)]">WHERE</span>
              <p className="text-[18px] font-semibold">{info.venue}</p>
              <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
                {info.address}
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-[var(--radius-lg)] border border-white/70 bg-white/80 p-6 shadow-[0_16px_40px_rgba(41,32,26,0.1)]"
          data-animate="fade-up"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] tracking-[0.35em] text-[var(--muted)]">
                DIRECTIONS
              </span>
              <span className="text-[12px] text-[var(--accent-strong)]">MAP</span>
            </div>
            <div className="relative overflow-hidden rounded-[20px] border border-white/70 bg-gradient-to-br from-[#f3ede6] via-[#efe4d9] to-[#f9f5f0] px-5 py-6">
              <div className="absolute inset-0 opacity-[0.2] [background:radial-gradient(circle_at_top,_rgba(0,0,0,0.08),_transparent_60%)]" />
              <p className="relative text-[13px] text-[var(--text-muted)]">
                지도 영역 · 위치 안내를 위한 플레이스홀더
              </p>
            </div>
            <ul className="flex list-disc flex-col gap-2 pl-4 text-[13px] leading-relaxed text-[var(--text-secondary)]">
              {info.directions.map((direction) => (
                <li key={direction}>{direction}</li>
              ))}
            </ul>
          </div>
        </div>

        {info.notices?.length ? (
          <div
            className="rounded-[var(--radius-lg)] border border-white/70 bg-white/80 p-6 shadow-[0_16px_36px_rgba(41,32,26,0.08)]"
            data-animate="fade-up"
          >
            <p className="text-[11px] tracking-[0.35em] text-[var(--muted)]">NOTICE</p>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-4 text-[13px] leading-relaxed text-[var(--text-secondary)]">
              {info.notices.map((notice) => (
                <li key={notice}>{notice}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};
