export type InvitationTheme = {
  fonts: {
    serif: string;
    serifEn: string;
    sans: string;
  };
  colors: {
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      muted: string;
    };
    accent: {
      rose: string;
      roseDark: string;
      roseLight: string;
      burgundy: string;
      gold: string;
    };
    weddingHighlight: {
      text: string;
      background: string;
    };
    card: {
      background: string;
      border: string;
    };
    border: {
      light: string;
      divider: string;
    };
  };
  shadow: {
    soft: string;
    medium: string;
    card: string;
  };
  radius: {
    lg: string;
    md: string;
    sm: string;
  };
};

export type InvitationAssets = {
  heroImage: string;
  loadingImage: string;
  share: {
    ogImage: string;
    kakaoImage: string;
  };
};

export type InvitationStorage = {
  guestbook: {
    key: string;
  };
  rsvp: {
    key: string;
  };
};

export type InvitationMeta = {
  locale: string;
  timeZone: string;
};

export type InvitationPerson = {
  firstName: string;
  lastName: string;
  bio?: string;
  profileImage?: string;
};

export type InvitationParents = {
  groom: {
    father?: string;
    mother?: string;
  };
  bride: {
    father?: string;
    mother?: string;
  };
};

export type InvitationCouple = {
  groom: InvitationPerson;
  bride: InvitationPerson;
  parents: InvitationParents;
};

export type InvitationEvent = {
  dateTime: string;
  venue: string;
  address: string;
};

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  passwordHash?: string;
};

export type InvitationGuestbook = {
  privacyNotice: string;
  retentionText: string;
  mockEntries: GuestbookEntry[];
  displayMode: 'recent' | 'paginated';
  pageSize: number;
  recentNotice: string;
  enablePassword: boolean;
  enableEdit: boolean;
  enableDelete: boolean;
  section_title?: string;
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
  section_title?: string;
};

export type InvitationAccount = {
  bankName: string;
  accountNumber: string;
  holder: string;
  label?: string;
};

export type InvitationAccounts = {
  section_title: string;
  description: string;
  groom: InvitationAccount[];
  bride: InvitationAccount[];
};

export type InvitationLoading = {
  enabled: boolean;
  message: string;
  minDuration: number;
  additionalDuration: number;
  section_title: string;
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
  section_title: string;
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
  section_title?: string;
};

export type InvitationGreeting = {
  message: string[];
  poeticNote?: string;
  section_title?: string;
};

export type InvitationSectionTitles = {
  loading: string;
  greeting: string;
  couple: string;
  wedding: string;
  location: string;
  guestbook: string;
  rsvp: string;
  share: string;
};

export type InvitationRsvpResponse = {
  id: string;
  name: string;
  attendance: string;
  companions?: string;
  meal?: string;
  notes?: string;
  submittedAt: string;
};

export type InvitationBgm = {
  enabled: boolean;
  audioUrl?: string;
  autoPlay: boolean;
  loop: boolean;
};

export type InvitationLocation = {
  placeName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  transportation: {
    subway?: string[];
    bus?: string[];
    car?: string;
    parking?: string;
  };
  notices?: string[];
  section_title?: string;
};

export type InvitationClosing = {
  section_title: string;
  message: string;
  copyright?: string;
};

export type InvitationContent = {
  loading: InvitationLoading;
  event: InvitationEvent;
  greeting: InvitationGreeting;
  couple: InvitationCouple;
  location: InvitationLocation;
  gallery: InvitationGallery;
  share: InvitationShare;
  rsvp: InvitationRsvp;
  rsvpResponses: InvitationRsvpResponse[];
  guestbook: InvitationGuestbook;
  accounts: InvitationAccounts;
  bgm: InvitationBgm;
  closing: InvitationClosing;
  sectionTitles: InvitationSectionTitles;
};

export type InvitationMock = {
  meta: InvitationMeta;
  theme: InvitationTheme;
  storage: InvitationStorage;
  assets: InvitationAssets;
  content: InvitationContent;
};

const assets: InvitationAssets = {
  heroImage: '/mock/main-image.png',
  loadingImage: '/mock/main-image.png',
  share: {
    ogImage: 'https://placehold.co/1200x630/F6EFE7/c19a7b?text=Wedding+Invitation',
    kakaoImage: 'https://placehold.co/800x400/F6EFE7/c19a7b?text=Wedding',
  },
};

export const invitationMock: InvitationMock = {
  meta: {
    locale: 'ko-KR',
    timeZone: 'Asia/Seoul',
  },
  theme: {
    fonts: {
      serif: 'var(--font-gowun), var(--font-nanum), "Gowun Batang", "Nanum Myeongjo", Georgia, serif',
      serifEn: 'var(--font-crimson), Georgia, "Times New Roman", serif',
      sans: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif',
    },
    colors: {
      background: {
        primary: '#FAF9F7',
        secondary: '#F5F3F0',
        tertiary: '#F0EDE8',
      },
      text: {
        primary: '#2C2420',
        secondary: '#4A423C',
        tertiary: '#7A726C',
        muted: '#9A928C',
      },
      accent: {
        rose: '#C4A092',
        roseDark: '#A67C6B',
        roseLight: '#E8D5CC',
        burgundy: '#8B4A5E',
        gold: '#B8956C',
      },
      weddingHighlight: {
        text: '#E8A4B3',
        background: '#FCF0F3',
      },
      card: {
        background: 'rgba(255, 255, 255, 0.85)',
        border: 'rgba(255, 255, 255, 0.6)',
      },
      border: {
        light: 'rgba(44, 36, 32, 0.08)',
        divider: 'rgba(196, 160, 146, 0.3)',
      },
    },
    shadow: {
      soft: '0 2px 12px rgba(44, 36, 32, 0.06)',
      medium: '0 4px 20px rgba(44, 36, 32, 0.08)',
      card: '0 8px 32px rgba(44, 36, 32, 0.06)',
    },
    radius: {
      lg: '24px',
      md: '16px',
      sm: '10px',
    },
  },
  storage: {
    guestbook: {
      key: 'wedding-guestbook',
    },
    rsvp: {
      key: 'wedding-rsvp',
    },
  },
  assets,
  content: {
    loading: {
      enabled: true,
      section_title: 'WEDDING INVITATION',
      message: 'We are getting married',
      minDuration: 1500,
      additionalDuration: 1000,
    },
    event: {
      dateTime: '2026-05-16T15:00:00+09:00',
      venue: '채림 웨딩홀',
      address: '경기도 부천시 원미구 심곡동 173-1',
    },
    greeting: {
      message: [
        '두 사람의 이야기가 열리고 있어요.',
        '서로의 오늘이 되어, 함께 걸어가려 합니다.',
        '',
        '진심 어린 축복 속에',
        '그 첫걸음을 함께해 주시면 감사하겠습니다.',
      ],
      poeticNote: '민들레 홀씨처럼 날아와 영원한 사랑을 만났습니다',
      section_title: '초대합니다',
    },
    couple: {
      groom: {
        firstName: '신랑',
        lastName: '강',
        bio: '조용한 다정함으로 하루를 따뜻하게 만드는 사람입니다.',
        profileImage: '/mock/groom-front-512.png',
      },
      bride: {
        firstName: '신부',
        lastName: '장',
        bio: '웃음을 나누는 순간이 가장 소중한 사람입니다.',
        profileImage: '/mock/bride-front-512.png',
      },
      parents: {
        groom: {
          father: '강아버지',
          mother: '송어머니',
        },
        bride: {
          father: '장아버지',
          mother: '이어머니',
        },
      },
      section_title: '두 사람을 소개합니다',
    },
    location: {
      placeName: '채림웨딩홀',
      coordinates: {
        lat: 37.48466092361281,
        lng: 126.78204185207186,
      },
      transportation: {
        subway: ['지하철 1호선 부천역 3번, 4번, 7번 출구'],
        bus: ['5, 12, 23번 부천역 하차 후 도보 7분'],
        parking: '로얄쇼핑주차장 (채림웨딩홀 전용주차장) 약 3시간 무료',
      },
      notices: [
        '예식 후 간단한 식사가 준비되어 있습니다.',
        '주말 교통 혼잡이 예상되오니 여유 있게 출발해주세요.',
      ],
      section_title: '오시는 길',
    },
    gallery: {
      section_title: '우리의 갤러리',
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
      autoplay: true,
      autoplayDelay: 3000,
    },
    share: {
      section_title: '청첩장 공유하기',
      title: '강신랑 · 장신부 결혼식에 초대합니다',
      description: '2026년 05월 16일 오후 3시 00분 | 채림 웨딩홀',
      imageUrl: assets.share.ogImage,
      kakaoTemplate: {
        title: '결혼식에 초대합니다',
        description: '강신랑 · 장신부\n2026년 05월 16일 오후 3시 00분\n채림 웨딩홀',
        imageUrl: assets.share.kakaoImage,
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
        options: ['1명', '2명', '3명', '4명', '5명이상'],
      },
      ],
      consent: {
        title: '개인정보 수집 및 이용 동의',
        description: '참석 여부 확인과 예식 안내를 위해 이름, 연락처, 응답 내용을 수집합니다.',
        retention: '수집일로부터 예식 종료 후 최대 12개월까지 보관합니다.',
        notice: '동의하지 않을 경우 참석 여부 접수가 제한됩니다.',
      },
      section_title: '참석 여부',
    },
    rsvpResponses: [
      {
        id: 'rsvp-1',
        name: '민지',
        attendance: '참석',
        companions: '2명',
        meal: '식사함',
        notes: '축하드립니다!',
        submittedAt: '2026-05-01T09:20:00+09:00',
      },
      {
        id: 'rsvp-2',
        name: '현우',
        attendance: '불참',
        companions: '0명',
        meal: '식사하지 않음',
        notes: '멀리서 축하할게요.',
        submittedAt: '2026-05-02T14:15:00+09:00',
      },
    ],
    guestbook: {
      privacyNotice: '개인정보는 예식 이후 최대 12개월 보관 후 삭제됩니다.',
      retentionText: '축하 메시지는 예식 당일 함께 공유됩니다.',
      displayMode: 'recent',
      pageSize: 5,
      recentNotice: '최근 5개의 메시지만 먼저 보여드려요.',
      enablePassword: true,
      enableEdit: true,
      enableDelete: true,
      section_title: '축하 메시지',
      mockEntries: [
        {
          id: 'guest-1',
          name: '민지',
          message: '두 분의 새로운 시작을 진심으로 축하해요!',
          createdAt: '2026-05-01T10:30:00+09:00',
          passwordHash: '134bf72d1eda184a9de23f4fa2512c3364424cbd9163c21a14cde9610e7c570f',
        },
        {
          id: 'guest-2',
          name: '현우',
          message: '행복한 결혼 생활을 응원합니다!',
          createdAt: '2026-05-02T14:15:00+09:00',
          passwordHash: '134bf72d1eda184a9de23f4fa2512c3364424cbd9163c21a14cde9610e7c570f',
        },
      ],
    },
    accounts: {
      section_title: '마음 전하실 곳',
      description: '축하의 마음만 전해주셔도 감사한 하루입니다.',
      groom: [
        {
          label: '신랑',
          bankName: '국민은행',
          accountNumber: '123-456-789012',
          holder: '강신랑',
        },
        {
          label: '아버지',
          bankName: '신한은행',
          accountNumber: '123-456-000000',
          holder: '강버지',
        },
      ],
      bride: [
        {
          label: '신부',
          bankName: '신한은행',
          accountNumber: '110-234-567890',
          holder: '장신부',
        },
        {
          label: '어머니',
          bankName: '하나은행',
          accountNumber: '110-000-000000',
          holder: '한머니',
        },
      ],
    },
    bgm: {
      enabled: true,
      audioUrl: '/mock/bgm-sample.mp3',
      autoPlay: true,
      loop: true,
    },
    closing: {
      section_title: 'THANK YOU',
      message: '소중한 분들과 함께하는 이 자리, 오래 기억하겠습니다.',
      copyright: '© 2026. All rights reserved.',
    },
    sectionTitles: {
      loading: 'WEDDING INVITATION',
      greeting: '초대합니다',
      couple: '두 사람을 소개합니다',
      wedding: '결혼합니다',
      location: '오시는 길',
      guestbook: '축하 메시지',
      rsvp: '참석 여부',
      share: '청첩장 공유하기',
    },
  },
};
