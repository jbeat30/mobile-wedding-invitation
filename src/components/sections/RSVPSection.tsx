'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import type { InvitationRsvp } from '@/mock/invitation.mock';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { SelectField } from '@/components/ui/SelectField';
import { TextArea, TextInput } from '@/components/ui/TextInput';
import { Toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatMonthDay } from '@/utils/date';
import { postJson } from '@/utils/api';
import { hasRequiredFields, normalizeCompanions } from '@/utils/rsvp';

// 쿨다운 유틸리티
const RSVP_COOLDOWN_KEY = 'rsvp-last-submit';
const COOLDOWN_DURATION = 5 * 60 * 1000; // 5분

const getRsvpRemainingCooldown = (): number => {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(RSVP_COOLDOWN_KEY);
    if (!stored) return 0;
    const elapsed = Date.now() - parseInt(stored, 10);
    const remaining = COOLDOWN_DURATION - elapsed;
    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
};

const setRsvpLastSubmitTime = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RSVP_COOLDOWN_KEY, Date.now().toString());
  } catch {
    // ignore
  }
};

const formatCooldownTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}분 ${seconds}초`;
};

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
  const [toastMessage, setToastMessage] = useState('참석 여부가 전달되었습니다');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isValid() || isSubmitting) return;

      // 쿨다운 체크
      const remainingCooldown = getRsvpRemainingCooldown();
      if (remainingCooldown > 0) {
        const timeLeft = formatCooldownTime(remainingCooldown);
        setToastMessage(`잠시 후 다시 시도해주세요 (${timeLeft} 남음)`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      // 확인 다이얼로그 표시
      setShowConfirmDialog(true);
    },
    [isValid, isSubmitting]
  );

  const handleConfirmSubmit = useCallback(async () => {
    if (!isValid() || isSubmitting) return;

    setShowConfirmDialog(false);
    setIsSubmitting(true);

    try {
      const companionsValue = normalizeCompanions(attendanceValue, formData.companions || '');
      const payload = {
        ...formData,
        companions: companionsValue,
        submittedAt: new Date().toISOString(),
      };

      // 먼저 API 요청 수행
      const response = await postJson('/api/rsvp', payload);
      if (!response.ok) {
        throw new Error('RSVP request failed');
      }

      // API 성공 후에만 상태 업데이트
      localStorage.setItem(storageKey, JSON.stringify(payload));

      // 쿨다운 타이머 설정
      setRsvpLastSubmitTime();

      // 폼 초기화하여 전송되었음을 명확히 표시
      setFormData({});
      setConsent(false);

      // 성공 토스트 표시
      setToastMessage('참석 여부가 전달되었습니다');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('RSVP submit error:', error);

      // 실패 토스트 표시
      setToastMessage('전달에 실패했습니다. 다시 시도해주세요.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  }, [isValid, isSubmitting, formData, attendanceValue, storageKey]);

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
          <div
            className="text-center"
            data-animate="fade-up"
            data-animate-start="90"
            data-animate-trigger="section"
          >
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
            data-animate-start="90"
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
                ) : field.inputType === 'text' ? (
                  <TextInput
                    id={`rsvp-${field.key}`}
                    type="text"
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
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
            <Button type="submit" size="full" disabled={!isValid() || isSubmitting}>
              {isSubmitting ? '전달 중...' : '참석 여부 전달하기'}
            </Button>
          </SurfaceCard>
        </div>
      </section>

      {/* 제출 확인 다이얼로그 */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>참석 여부를 전달하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              작성하신 참석 정보가 전달됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>전달하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 토스트 메시지 */}
      <Toast
        isOpen={showToast}
        message={toastMessage}
        toastClassName="py-2"
      />
    </>
  );
};
