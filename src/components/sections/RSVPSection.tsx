'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import type { InvitationRsvp } from '@/mock/invitation.mock';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { SelectField } from '@/components/ui/SelectField';
import { TextArea } from '@/components/ui/TextInput';
import { Toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { formatMonthDay } from '@/utils/date';
import { postJson } from '@/utils/api';
import { hasRequiredFields, normalizeCompanions } from '@/utils/rsvp';

type RSVPSectionProps = {
  rsvp: InvitationRsvp;
  storageKey: string;
  title: string;
};

/**
 * RSVP (참석 여부) 섹션
 */
export const RSVPSection = ({ rsvp, storageKey, title }: RSVPSectionProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const deadlineText = rsvp.deadline
    ? `${formatMonthDay(rsvp.deadline)}까지 회신 부탁드립니다`
    : '참석 여부를 알려주세요';
  const attendanceValue = formData.attendance || '';
  const isNotAttending = attendanceValue === '불참';

  useEffect(() => {
    if (isNotAttending) {
      const updates: Record<string, string> = {};

      if (rsvp.fields.some((field) => field.key === 'companions')) {
        updates.companions = '0명';
      }

      if (rsvp.fields.some((field) => field.key === 'meal')) {
        updates.meal = '식사하지 않음';
      }

      setFormData((prev) => ({ ...prev, ...updates }));
      return;
    }

    // 참석으로 변경 시 자동 설정된 값 초기화
    const resetUpdates: Record<string, string> = {};

    if (formData.companions === '0명') {
      resetUpdates.companions = '';
    }

    if (formData.meal === '식사하지 않음') {
      resetUpdates.meal = '';
    }

    if (Object.keys(resetUpdates).length > 0) {
      setFormData((prev) => ({ ...prev, ...resetUpdates }));
    }
  }, [isNotAttending, rsvp.fields, formData.companions, formData.meal]);

  const requiredFieldKeys = useMemo(
    () => rsvp.fields.filter((field) => field.required).map((field) => field.key),
    [rsvp.fields]
  );

  const isValid = useCallback(() => {
    if (!consent) return false;
    return hasRequiredFields(requiredFieldKeys, formData);
  }, [formData, consent, requiredFieldKeys]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isValid()) return;

      const companionsValue = normalizeCompanions(attendanceValue, formData.companions || '');
      const payload = {
        ...formData,
        companions: companionsValue,
        submittedAt: new Date().toISOString(),
      };

      // localStorage에 저장 (Mock)
      localStorage.setItem(storageKey, JSON.stringify(payload));

      try {
        const response = await postJson('/api/rsvp', payload);
        if (!response.ok) {
          throw new Error('RSVP request failed');
        }
      } catch (error) {
        console.error('RSVP submit error:', error);
      }

      // 토스트 표시
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // 폼 초기화
      setFormData({});
      setConsent(false);
    },
    [isValid, formData, attendanceValue, storageKey]
  );

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (!rsvp.enabled) return null;

  return (
    <>
      <section
        id="rsvp"
        className="bg-[var(--bg-primary)] py-12"
      >
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8 px-6">
          {/* 섹션 헤더 */}
          <div className="text-center" data-animate="fade-up" data-animate-trigger="section">
            <SectionHeader
              kicker="RSVP"
              title={title}
              description={deadlineText}
              kickerClassName="font-label text-[14px] text-[var(--accent-rose)]"
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
                    disabled={(field.key === 'companions' || field.key === 'meal') && isNotAttending}
                  >
                    <option value="">선택해주세요</option>
                    {field.key === 'companions' && isNotAttending ? (
                      <option value="0명">0명</option>
                    ) : field.key === 'meal' && isNotAttending ? (
                      <option value="식사하지 않음">식사하지 않음</option>
                    ) : (
                      field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))
                    )}
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
            <Button type="submit" size="full" disabled={!isValid()}>
              참석 여부 전달하기
            </Button>
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
