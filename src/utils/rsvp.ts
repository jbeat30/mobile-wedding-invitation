import { isRequiredText } from '@/utils/validation';

/**
 * 불참 여부 기준으로 동반 인원 값 정규화
 * @param attendance string
 * @param companions string
 * @returns string
 */
export const normalizeCompanions = (attendance: string, companions: string) => {
  if (attendance === '불참') {
    return '0명';
  }

  return companions;
};

/**
 * RSVP 필수 항목 검증
 * @param requiredKeys string[]
 * @param payload Record<string, string>
 * @returns boolean
 */
export const hasRequiredFields = (
  requiredKeys: string[],
  payload: Record<string, string>
) => {
  return requiredKeys.every((key) => isRequiredText(payload[key] || ''));
};
