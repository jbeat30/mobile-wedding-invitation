'use client';

import { useCallback, useState, type FormEvent } from 'react';
import { invitationMock } from '@/mock/invitation.mock';

/**
 * RSVP (참석 여부) 섹션
 */
export const RSVPSection = () => {
  const { rsvp } = invitationMock;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isValid = useCallback(() => {
    if (!consent) return false;

    const requiredFields = rsvp.fields.filter((field) => field.required);
    return requiredFields.every((field) => formData[field.key]?.trim().length > 0);
  }, [formData, consent, rsvp.fields]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isValid()) return;

      // localStorage에 저장 (Mock)
      localStorage.setItem('wedding-rsvp', JSON.stringify({ ...formData, submittedAt: new Date().toISOString() }));

      // 토스트 표시
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // 폼 초기화
      setFormData({});
      setConsent(false);
    },
    [isValid, formData]
  );

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (!rsvp.enabled) return null;

  return (
    <>
      <section
        id="rsvp"
        className="bg-[var(--bg-secondary)] py-16"
      >
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6">
          {/* 섹션 헤더 */}
          <div className="text-center" data-animate="fade-up">
            <span className="text-[10px] tracking-[0.4em] text-[var(--muted)]">RSVP</span>
            <h2 className="font-[var(--font-nanum),serif] mt-3 text-[26px] font-semibold text-[var(--text-primary)]">
              참석 여부
            </h2>
            <p className="mt-2 text-[13px] text-[var(--text-secondary)]">
              {rsvp.deadline
                ? `${new Date(rsvp.deadline).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}까지 회신 부탁드립니다`
                : '참석 여부를 알려주세요'}
            </p>
          </div>

          {/* RSVP 폼 */}
          <form
            className="flex flex-col gap-5 rounded-[var(--radius-lg)] border border-white/70 bg-white/90 p-6 shadow-[var(--shadow-soft)] backdrop-blur"
            onSubmit={handleSubmit}
            data-animate="fade-up"
          >
            {rsvp.fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label
                  className="text-[10px] tracking-[0.35em] text-[var(--muted)]"
                  htmlFor={`rsvp-${field.key}`}
                >
                  {field.label}
                  {field.required && <span className="ml-1 text-red-500">*</span>}
                </label>

                {field.options ? (
                  <select
                    id={`rsvp-${field.key}`}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="rounded-[14px] border border-black/10 bg-white px-4 py-3 text-[14px] text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30"
                    required={field.required}
                  >
                    <option value="">선택해주세요</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <textarea
                    id={`rsvp-${field.key}`}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="min-h-[100px] rounded-[14px] border border-black/10 bg-white px-4 py-3 text-[14px] text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30"
                    required={field.required}
                  />
                )}
              </div>
            ))}

            {/* 개인정보 동의 */}
            <label className="flex items-start gap-3 rounded-[14px] border border-black/5 bg-[#fbf8f4] px-4 py-3 text-[12px] text-[var(--text-muted)]">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-[3px] h-4 w-4 accent-[var(--accent-strong)]"
              />
              <span>
                <strong className="text-[var(--text-primary)]">{rsvp.consent.title}</strong>
                <br />
                {rsvp.consent.description}
                <br />
                <span className="text-[11px]">{rsvp.consent.retention}</span>
              </span>
            </label>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={!isValid()}
              className="rounded-full bg-[var(--accent-strong)] py-3 text-[14px] font-medium text-white transition hover:bg-[var(--accent)] disabled:bg-[var(--base-surface-dark)] disabled:text-[var(--text-muted)]"
            >
              참석 여부 전달하기
            </button>
          </form>
        </div>
      </section>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed inset-x-0 bottom-[calc(var(--safe-bottom)+16px)] z-50 flex justify-center px-6">
          <div className="rounded-full bg-[#2f2f2f] px-5 py-2 text-[13px] text-white shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
            참석 여부가 전달되었습니다
          </div>
        </div>
      )}
    </>
  );
};
