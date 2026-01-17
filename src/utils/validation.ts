/**
 * 4자리 숫자 비밀번호 검증
 * @param value string
 * @returns boolean
 */
export const isFourDigitPassword = (value: string) => {
  return /^\d{4}$/.test(value);
};

/**
 * 공백 제거 후 필수 텍스트 여부 확인
 * @param value string
 * @returns boolean
 */
export const isRequiredText = (value: string) => {
  return value.trim().length > 0;
};
