export type InvitationIntroTheme = {
  darkBackground: string;
  lightBackground: string;
  textColor: string;
  accentColor: string;
};

export type InvitationIntro = {
  quote: string;
  subQuote?: string;
  theme: InvitationIntroTheme;
};

export type InvitationPerson = {
  fullName: string;
  displayName: string;
  bio?: string;
  profileImage?: string;
  role?: string;
};

export type InvitationFamilyMember = {
  role: 'father' | 'mother' | 'guardian' | 'other';
  name: string;
  prefix?: string;
  suffix?: string;
};

export type InvitationFamilyLine = {
  subject: 'groom' | 'bride';
  relationshipLabel: string;
  members: InvitationFamilyMember[];
};

export type InvitationCouple = {
  groom: InvitationPerson;
  bride: InvitationPerson;
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
  displayMode: 'recent' | 'paginated';
  pageSize: number;
  recentNotice: string;
};

export type InvitationRsvpField = {
  key: 'attendance' | 'meal' | 'companions' | 'notes';
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

export type InvitationLoading = {
  enabled: boolean;
  message: string;
  minDuration: number; // 최소 로딩 시간 (ms)
  additionalDuration: number; // 페이지 로딩 완료 후 추가 대기 시간 (ms)
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  thumbnail?: string;
  width?: number;
  height?: number;
};

export type InvitationGallery = {
  title: string;
  description?: string;
  images: GalleryImage[];
  autoplay?: boolean;
  autoplayDelay?: number;
};

export type InvitationShare = {
  title: string;
  description: string;
  imageUrl: string;
  kakaoTemplate?: {
    title: string;
    description: string;
    imageUrl: string;
    buttonLabel?: string;
  };
};

export type InvitationMock = {
  weddingDateTime: string;
  loading: InvitationLoading;
  couple: InvitationCouple;
  intro: InvitationIntro;
  info: InvitationInfo;
  gallery: InvitationGallery;
  share: InvitationShare;
  rsvp: InvitationRsvp;
  guestbook: InvitationGuestbook;
  accounts: InvitationAccounts;
};

export const invitationMock: InvitationMock = {
  weddingDateTime: '2026-05-16T15:00:00+09:00',
  loading: {
    enabled: true,
    message: 'We are getting married',
    minDuration: 1500,
    additionalDuration: 1000,
  },
  couple: {
    groom: {
      fullName: '강신랑',
      displayName: '강신랑',
      bio: '조용한 다정함으로 하루를 따뜻하게 만드는 사람입니다.',
      profileImage: '/mock/groom-front-512.png',
      role: '신랑',
    },
    bride: {
      fullName: '장신부',
      displayName: '장신부',
      bio: '웃음을 나누는 순간이 가장 소중한 사람입니다.',
      profileImage: '/mock/bride-front-512.png',
      role: '신부',
    },
    familyLines: [
      {
        subject: 'groom',
        relationshipLabel: '아들',
        members: [
          {
            role: 'father',
            name: '강아버지',
          },
          {
            role: 'mother',
            name: '송어머니',
          },
        ],
      },
      {
        subject: 'bride',
        relationshipLabel: '딸',
        members: [
          {
            role: 'father',
            name: '장아버지',
          },
          {
            role: 'mother',
            name: '이어머니',
          },
        ],
      },
    ],
  },
  intro: {
    quote: '서로의 오늘이 되어, 함께 걸어가려 합니다.',
    subQuote: '소중한 분들을 모시고 작은 약속을 나누고자 합니다.',
    theme: {
      darkBackground: '#2f2722',
      lightBackground: '#f7f2ec',
      textColor: '#4d4036',
      accentColor: '#c19a7b',
    },
  },
  info: {
    title: '결혼합니다',
    venue: '채림 웨딩홀',
    dateText: '2026년 5월 16일 (토) 오후 3시',
    address: '경기도 부천시 원미구 심곡동 173-1',
    directions: [
      '지하철 1호선 부천역(북부역광장 방면) - 지상 3번, 4번, 지하 7번 출구 이용',
      '버스 5, 12, 23번 부천역 하차 후 도보 7분',
      '주차: 로얄쇼핑주차장 (채림웨딩홀 전용주차장) 약 3시간 무료',
    ],
    notices: [
      '예식 후 간단한 식사가 준비되어 있습니다.',
      '주말 교통 혼잡이 예상되오니 여유 있게 출발해주세요.',
    ],
  },
  gallery: {
    title: '우리의 갤러리',
    description: '함께한 시간을 담은 작은 기록',
    images: [
      {
        id: 'gallery-1',
        src: 'https://placehold.co/900x700/F6EFE7/c19a7b?text=Gallery+1',
        alt: '웨딩 사진 1',
        width: 800,
        height: 600,
      },
      {
        id: 'gallery-2',
        src: 'https://placehold.co/900x700/F1E7DC/c19a7b?text=Gallery+2',
        alt: '웨딩 사진 2',
        width: 800,
        height: 600,
      },
      {
        id: 'gallery-3',
        src: 'https://placehold.co/900x700/F8F4EE/c19a7b?text=Gallery+3',
        alt: '웨딩 사진 3',
        width: 800,
        height: 600,
      },
      {
        id: 'gallery-4',
        src: 'https://placehold.co/900x700/EDE3D8/c19a7b?text=Gallery+4',
        alt: '웨딩 사진 4',
        width: 800,
        height: 600,
      },
      {
        id: 'gallery-5',
        src: 'https://placehold.co/900x700/F5ECE2/c19a7b?text=Gallery+5',
        alt: '웨딩 사진 5',
        width: 800,
        height: 600,
      },
      {
        id: 'gallery-6',
        src: 'https://placehold.co/900x700/F5ECE2/c19a7b?text=Gallery+6',
        alt: '웨딩 사진 6',
        width: 800,
        height: 600,
      },
    ],
    autoplay: false,
  },
  share: {
    title: '강신랑 · 장신부 결혼식에 초대합니다',
    description: '2026년 05월 16일 오후 3시 00분 | 채림 웨딩홀',
    imageUrl: 'https://placehold.co/1200x630/F6EFE7/c19a7b?text=Wedding+Invitation',
    kakaoTemplate: {
      title: '결혼식에 초대합니다',
      description: '강신랑 · 장신부\n2026년 05월 16일 오후 3시 00분\n채림 웨딩홀',
      imageUrl: 'https://placehold.co/800x400/F6EFE7/c19a7b?text=Wedding',
      buttonLabel: '청첩장 보기',
    },
  },
  rsvp: {
    enabled: true,
    deadline: '2026-04-16T15:00:00+09:00',
    fields: [
      {
        key: 'attendance',
        label: '참석 여부',
        required: true,
        options: ['참석', '불참'],
      },
      {
        key: 'meal',
        label: '식사 여부',
        required: true,
        options: ['식사함', '식사하지 않음'],
      },
      {
        key: 'companions',
        label: '동반 인원',
        required: false,
        options: ['0명', '1명', '2명', '3명', '4명', '5명이상'],
      },
    ],
    consent: {
      title: '개인정보 수집 및 이용 동의',
      description: '참석 여부 확인과 예식 안내를 위해 이름, 연락처, 응답 내용을 수집합니다.',
      retention: '수집일로부터 예식 종료 후 최대 12개월까지 보관합니다.',
      notice: '동의하지 않을 경우 참석 여부 접수가 제한됩니다.',
    },
  },
  guestbook: {
    privacyNotice: '보유기록: 예식 이후 최대 12개월 보관 후 삭제됩니다.',
    retentionText: '축하 메시지는 예식 당일 함께 공유됩니다.',
    displayMode: 'recent',
    pageSize: 5,
    recentNotice: '최근 5개의 메시지만 먼저 보여드려요.',
    mockEntries: [
      {
        id: 'guest-1',
        name: '민지',
        message: '두 분의 새로운 시작을 진심으로 축하해요!',
        createdAt: '2026-05-01T10:30:00+09:00',
      },
      {
        id: 'guest-2',
        name: '현우',
        message: '행복한 결혼 생활을 응원합니다!',
        createdAt: '2026-05-02T14:15:00+09:00',
      },
    ],
  },
  accounts: {
    title: '마음 전하실 곳',
    description: '축하의 마음만 전해주셔도 감사한 하루입니다.',
    groom: [
      {
        bankName: '국민은행',
        accountNumber: '123-456-789012',
        holder: '강신랑',
      },
    ],
    bride: [
      {
        bankName: '신한은행',
        accountNumber: '110-234-567890',
        holder: '장신부',
      },
    ],
  },
};
