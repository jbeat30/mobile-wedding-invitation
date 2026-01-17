/**
 * 날짜 문자열을 "월 일" 형식으로 변환
 * @param value
 */
/**
 * 월일 포맷 변환
 * @param value string
 * @returns string
 */
export const formatMonthDay = (value: string) => {
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
  return formatter.format(new Date(value));
};
