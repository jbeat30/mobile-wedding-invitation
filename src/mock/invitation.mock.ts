export type InvitationIntroTheme = {
  darkBackground: string;
  lightBackground: string;
  textColor: string;
  accentColor: string;
};

export type InvitationIntroDoor = {
  leftImage: string;
  rightImage: string;
  frameImage: string;
  heroImage: string;
};

export type InvitationIntro = {
  quote: string;
  door: InvitationIntroDoor;
  theme: InvitationIntroTheme;
};

export type InvitationInfo = {
  title: string;
  venue: string;
  dateText: string;
  address: string;
  directions: string[];
};

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export type InvitationGuestbook = {
  privacyNotice: string;
  retentionText: string;
  mockEntries: GuestbookEntry[];
};

export type InvitationAccount = {
  bankName: string;
  accountNumber: string;
  holder: string;
};

export type InvitationAccounts = {
  title: string;
  description: string;
  groom: InvitationAccount[];
  bride: InvitationAccount[];
};

export type InvitationMock = {
  weddingDateTime: string;
  intro: InvitationIntro;
  info: InvitationInfo;
  guestbook: InvitationGuestbook;
  accounts: InvitationAccounts;
};

export const invitationMock: InvitationMock = {
  weddingDateTime: "2026-05-16T13:00:00+09:00",
  intro: {
    quote: "우리의 새로운 문이 열리는 날",
    door: {
      leftImage: "/mock/pngtree-white-romantic-wedding-door-close.png",
      rightImage: "/mock/pngtree-white-romantic-wedding-door-close.png",
      frameImage: "/mock/door-frame.svg",
      heroImage: "/mock/hero-placeholder.svg",
    },
    theme: {
      darkBackground: "#0f0f0f",
      lightBackground: "#f7f2ea",
      textColor: "#f5f0e6",
      accentColor: "#cbb899",
    },
  },
  info: {
    title: "우리 결혼해요",
    venue: "아름다운웨딩홀 3층",
    dateText: "2026년 5월 16일 (토) 오후 1시",
    address: "서울시 강남구 웨딩로 12",
    directions: [
      "지하철 2호선 강남역 3번 출구 도보 7분",
      "주차: 지하 주차장 2시간 무료",
    ],
  },
  guestbook: {
    privacyNotice: "방명록은 행사 이후 3개월 보관 후 삭제됩니다.",
    retentionText: "축하 메시지는 예식 당일 현장에서 함께 공유됩니다.",
    mockEntries: [
      {
        id: "guest-1",
        name: "민지",
        message: "두 분의 새로운 시작을 진심으로 축하해요!",
        createdAt: "2026-05-01T10:30:00+09:00",
      },
      {
        id: "guest-2",
        name: "현우",
        message: "행복한 결혼 생활을 응원합니다!",
        createdAt: "2026-05-02T14:15:00+09:00",
      },
    ],
  },
  accounts: {
    title: "마음 전하실 곳",
    description: "축하의 마음을 전해주실 분들을 위한 계좌 안내입니다.",
    groom: [
      {
        bankName: "국민은행",
        accountNumber: "123-456-789012",
        holder: "김신랑",
      },
    ],
    bride: [
      {
        bankName: "신한은행",
        accountNumber: "110-234-567890",
        holder: "이신부",
      },
    ],
  },
};
