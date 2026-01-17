'use client';

import { useCallback, useState, type FormEvent } from 'react';
import type { InvitationRsvp } from '@/mock/invitation.mock';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { SelectField } from '@/components/ui/SelectField';
import { TextArea } from '@/components/ui/TextInput';
import { Toast } from '@/components/ui/Toast';

type RSVPSectionProps = {
  rsvp: InvitationRsvp;
  storageKey: string;
};

/**
 * RSVP (참석 여부) 섹션
 */
export const RSVPSection = ({ rsvp, storageKey }: RSVPSectionProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const deadlineText = rsvp.deadline
    ? `${new Date(rsvp.deadline).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}까지 회신 부탁드립니다`
    : '참석 여부를 알려주세요';

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
      localStorage.setItem(
        storageKey,
        JSON.stringify({ ...formData, submittedAt: new Date().toISOString() })
      );

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
        className="bg-[var(--bg-primary)] py-16"
      >
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8 px-6">
          {/* 섹션 헤더 */}
          <div className="text-center" data-animate="fade-up">
            <SectionHeader
              kicker="RSVP"
              title="참석 여부"
              description={deadlineText}
              kickerClassName="font-label text-[12px] text-[var(--accent-rose)]"
              titleClassName="mt-2 text-[24px] font-medium text-[var(--text-primary)]"
              descriptionClassName="mt-2 text-[14px] text-[var(--text-tertiary)]"
            />
          </div>

          {/* RSVP 폼 */}
          <SurfaceCard
            as="form"
            className="flex flex-col gap-4 p-5"
            onSubmit={handleSubmit}
            data-animate="fade-up"
          >
            {rsvp.fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <FieldLabel htmlFor={`rsvp-${field.key}`} required={field.required}>
                  {field.label}
                </FieldLabel>

                {field.options ? (
                  <SelectField
                    id={`rsvp-${field.key}`}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    required={field.required}
                  >
                    <option value="">선택해주세요</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectField>
                ) : (
                  <TextArea
                    id={`rsvp-${field.key}`}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="min-h-[80px]"
                    required={field.required}
                  />
                )}
              </div>
            ))}

            {/* 개인정보 동의 */}
            <label className="flex items-start gap-3 rounded-[12px] bg-[var(--bg-secondary)] px-4 py-3 text-[12px] text-[var(--text-muted)]">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-[3px] h-4 w-4 accent-[var(--accent-burgundy)]"
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
              className="rounded-full bg-[var(--accent-burgundy)] py-3 text-[14px] text-white transition hover:opacity-90 disabled:bg-[var(--bg-tertiary)] disabled:text-[var(--text-muted)]"
            >
              참석 여부 전달하기
            </button>
          </SurfaceCard>
        </div>
      </section>

      {/* 토스트 메시지 */}
      <Toast
        isOpen={showToast}
        message="참석 여부가 전달되었습니다"
        toastClassName="py-2"
      />
    </>
  );
};
