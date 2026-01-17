/**
 * 날짜 문자열을 "월 일" 형식으로 변환
 * @param value
 */
export const formatMonthDay = (value: string) => {
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
  return formatter.format(new Date(value));
};
