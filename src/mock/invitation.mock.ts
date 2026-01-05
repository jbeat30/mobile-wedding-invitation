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
  subQuote?: string;
  door: InvitationIntroDoor;
  theme: InvitationIntroTheme;
};

export type InvitationPerson = {
  fullName: string;
  displayName: string;
  bio?: string;
};

export type InvitationFamilyMember = {
  role: "father" | "mother" | "guardian" | "other";
  name: string;
  prefix?: string;
  suffix?: string;
};

export type InvitationFamilyLine = {
  subject: "groom" | "bride";
  relationshipLabel: string;
  members: InvitationFamilyMember[];
};

export type InvitationCouple = {
  groom: InvitationPerson;
  bride: InvitationPerson;
  displayLine: string;
  familyLines?: InvitationFamilyLine[];
};

export type InvitationInfo = {
  title: string;
  venue: string;
  dateText: string;
  address: string;
  directions: string[];
  notices?: string[];
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

export type InvitationRsvpField = {
  key: "attendance" | "meal" | "companions" | "notes";
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
};

export type InvitationRsvpConsent = {
  title: string;
  description: string;
  retention: string;
  notice: string;
};

export type InvitationRsvp = {
  enabled: boolean;
  deadline: string;
  fields: InvitationRsvpField[];
  consent: InvitationRsvpConsent;
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
  couple: InvitationCouple;
  intro: InvitationIntro;
  info: InvitationInfo;
  rsvp: InvitationRsvp;
  guestbook: InvitationGuestbook;
  accounts: InvitationAccounts;
};

export const invitationMock: InvitationMock = {
  weddingDateTime: "2026-05-16T15:00:00+09:00",
  couple: {
    groom: {
      fullName: "강신랑",
      displayName: "신랑 강신랑",
      bio: "따뜻한 마음으로 새로운 여정을 준비합니다.",
    },
    bride: {
      fullName: "장신부",
      displayName: "신부 장신부",
      bio: "소중한 하루를 함께 나누고 싶습니다.",
    },
    displayLine: "강신랑 · 장신부",
    familyLines: [
      {
        subject: "groom",
        relationshipLabel: "아들",
        members: [
          {
            role: "father",
            name: "강아버지",
          },
          {
            role: "mother",
            name: "송어머니",
          },
        ],
      },
      {
        subject: "bride",
        relationshipLabel: "딸",
        members: [
          {
            role: "mother",
            name: "장어머니",
            prefix: "故",
          },
          {
            role: "guardian",
            name: "최보호자",
            suffix: "외가",
          },
        ],
      },
    ],
  },
  intro: {
    quote: "우리의 새로운 문이 열리는 날",
    subQuote: "소중한 분들과 함께 하고 싶습니다.",
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
    venue: "채림 웨딩홀",
    dateText: "2026년 5월 16일 (토) 오후 3시",
    address: "경기도 부천시 원미구 심곡동 173-1",
    directions: [
      "지하철 1호선 부천역(북부역광장 방면) - 지상 3번, 4번, 지하 7번출구 이용",
      "주차: 로얄쇼핑주차장 (채림웨딩홀 전용주차장) 약 3시간 무료",
    ],
    notices: [
      "예식 후 식사가 준비되어 있습니다.",
      "혼잡이 예상되오니 대중교통 이용을 권장드립니다.",
    ],
  },
  rsvp: {
    enabled: true,
    deadline: "2026-05-02T18:00:00+09:00",
    fields: [
      {
        key: "attendance",
        label: "참석 여부",
        required: true,
        options: ["참석", "불참"],
      },
      {
        key: "meal",
        label: "식사 여부",
        required: true,
        options: ["식사함", "식사하지 않음"],
      },
      {
        key: "companions",
        label: "동반 인원",
        required: false,
        options: ["0명", "1명", "2명", "3명", "4명", "5명이상"],
      },
      {
        key: "notes",
        label: "기타 전달사항",
        required: false,
        placeholder: "전하고 싶은 이야기가 있다면 남겨주세요.",
      },
    ],
    consent: {
      title: "개인정보 수집 및 이용 동의",
      description:
        "참석 여부 확인과 예식 안내를 위해 이름, 연락처, 응답 내용을 수집합니다.",
      retention: "수집일로부터 예식 종료 후 최대 12개월까지 보관합니다.",
      notice: "동의하지 않을 경우 참석 여부 접수가 제한됩니다.",
    },
  },
  guestbook: {
    privacyNotice: "보유기록: 행사 이후 최대 12개월 보관 후 삭제됩니다.",
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
        holder: "강신랑",
      },
    ],
    bride: [
      {
        bankName: "신한은행",
        accountNumber: "110-234-567890",
        holder: "장신부",
      },
    ],
  },
};
