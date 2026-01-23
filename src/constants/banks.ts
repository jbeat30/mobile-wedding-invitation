export type BankOption = {
  name: string;
  iconPath: string;
  iconAlt: string;
};

export const BANK_OPTIONS: BankOption[] = [
  { name: '국민은행', iconPath: '/icon/bank/kb-kookmin/original.jpg', iconAlt: 'KB국민은행' },
  { name: 'KB국민은행', iconPath: '/icon/bank/kb-kookmin/original.jpg', iconAlt: 'KB국민은행' },
  { name: '신한은행', iconPath: '/icon/bank/shinhan/original.jpg', iconAlt: '신한은행' },
  { name: 'KEB하나은행', iconPath: '/icon/bank/hana/original.jpg', iconAlt: '하나은행' },
  { name: '하나은행', iconPath: '/icon/bank/hana/original.jpg', iconAlt: '하나은행' },
  { name: '우리은행', iconPath: '/icon/bank/woori/original.jpg', iconAlt: '우리은행' },
  { name: 'IBK기업은행', iconPath: '/icon/bank/ibk/original.jpg', iconAlt: 'IBK기업은행' },
  { name: 'KDB산업은행', iconPath: '/icon/bank/kdb/original.jpg', iconAlt: 'KDB산업은행' },
  { name: 'SC제일은행', iconPath: '/icon/bank/sc-first/original.jpg', iconAlt: 'SC제일은행' },
  { name: 'iM뱅크', iconPath: '/icon/bank/im-bank/original.jpg', iconAlt: 'iM뱅크' },
  { name: '카카오뱅크', iconPath: '/icon/bank/kakao-bank/original.jpg', iconAlt: '카카오뱅크' },
  { name: '케이뱅크', iconPath: '/icon/bank/k-bank/original.jpg', iconAlt: '케이뱅크' },
  { name: '토스뱅크', iconPath: '/icon/bank/toss-bank/original.jpg', iconAlt: '토스뱅크' },
  { name: '씨티은행', iconPath: '/icon/bank/citi-bank/original.jpg', iconAlt: '씨티은행' },
  { name: '시티은행', iconPath: '/icon/bank/citi-bank/original.jpg', iconAlt: '씨티은행' },
  { name: 'NH농협은행', iconPath: '/icon/bank/nh-bank/original.jpg', iconAlt: 'NH농협은행' },
  { name: '수협은행', iconPath: '/icon/bank/suhyup-bank/original.jpg', iconAlt: '수협은행' },
  { name: '신협', iconPath: '/icon/bank/shinhyup/mono.jpg', iconAlt: '신협' },
  { name: '우체국', iconPath: '/icon/bank/korea-post/mono.jpg', iconAlt: '우체국' },
  { name: '부산은행', iconPath: '/icon/bank/busan-bank/original.jpg', iconAlt: '부산은행' },
  { name: '경남은행', iconPath: '/icon/bank/kyongnam-bank/original.jpg', iconAlt: '경남은행' },
  { name: '제주은행', iconPath: '/icon/bank/jeju-bank/original.jpg', iconAlt: '제주은행' },
  { name: '광주은행', iconPath: '/icon/bank/gwangju-bank/original.jpg', iconAlt: '광주은행' },
  { name: '전북은행', iconPath: '/icon/bank/jeonbuk-bank/original.jpg', iconAlt: '전북은행' },
  { name: 'SBI저축은행', iconPath: '/icon/bank/sbi-savings/original.jpg', iconAlt: 'SBI저축은행' },
];

const BANK_ICON_MAP = new Map<string, BankOption>(BANK_OPTIONS.map((option) => [option.name, option]));

/**
 * 은행명에 맞는 아이콘 정보를 반환합니다.
 * @param bankName 은행명
 * @returns BankOption | null
 */
export const getBankIcon = (bankName: string) => BANK_ICON_MAP.get(bankName) ?? null;
