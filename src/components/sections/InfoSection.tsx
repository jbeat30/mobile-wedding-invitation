import { invitationMock } from '@/mock/invitation.mock';

/**
 * 예식 정보 섹션 구성 확인
 */
export const InfoSection = () => {
  const { info, couple } = invitationMock;

  return (
    <section
      id="info"
      className="relative overflow-hidden bg-[var(--surface-light)] text-[var(--text-dark)]"
    >
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6 py-16">
        <div className="flex flex-col gap-4 text-center">
          <span className="text-[11px] tracking-[0.35em] text-[var(--muted)]">WEDDING</span>
          <h2 className="text-[26px] font-semibold text-[#3b3b3b]">{info.title}</h2>
          <p className="text-[14px] text-[var(--muted)]">
            {couple.groom.displayName} · {couple.bride.displayName}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-white/70 bg-white/90 p-6 shadow-[0_18px_40px_rgba(24,24,24,0.12)] backdrop-blur">
          <div className="flex flex-col gap-4 text-[15px] text-[#404040]">
            <div className="flex flex-col gap-2">
              <span className="text-[12px] tracking-[0.3em] text-[var(--muted)]">WHEN</span>
              <p className="text-[17px] font-medium">{info.dateText}</p>
            </div>
            <div className="h-px w-full bg-black/5" />
            <div className="flex flex-col gap-2">
              <span className="text-[12px] tracking-[0.3em] text-[var(--muted)]">WHERE</span>
              <p className="text-[17px] font-medium">{info.venue}</p>
              <p className="text-[14px] leading-relaxed text-[#5d5d5d]">{info.address}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-black/5 bg-white/60 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] tracking-[0.35em] text-[var(--muted)]">
                DIRECTIONS
              </span>
              <span className="text-[11px] text-[#9c8f7a]">MAP</span>
            </div>
            <div className="relative overflow-hidden rounded-[20px] border border-black/5 bg-gradient-to-br from-[#f3efe7] via-[#efe6dd] to-[#f9f6f1] px-5 py-6">
              <div className="absolute inset-0 opacity-[0.2] [background:radial-gradient(circle_at_top,_rgba(0,0,0,0.08),_transparent_60%)]" />
              <p className="relative text-[13px] text-[#6f655a]">
                지도 자리 · 상세 위치 안내
              </p>
            </div>
            <ul className="flex list-disc flex-col gap-2 pl-4 text-[13px] leading-relaxed text-[#5d5d5d]">
              {info.directions.map((direction) => (
                <li key={direction}>{direction}</li>
              ))}
            </ul>
          </div>
        </div>

        {info.notices?.length ? (
          <div className="rounded-[var(--radius-lg)] border border-black/5 bg-white/70 p-6">
            <p className="text-[12px] tracking-[0.35em] text-[var(--muted)]">NOTICE</p>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-4 text-[13px] leading-relaxed text-[#5d5d5d]">
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
