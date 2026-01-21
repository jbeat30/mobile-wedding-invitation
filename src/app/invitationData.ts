import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import type {
  InvitationMock,
  InvitationRsvpField,
  InvitationTheme,
} from '@/mock/invitation.mock';
import { invitationMock } from '@/mock/invitation.mock';

/** 기본 로케일 설정 */
const DEFAULT_LOCALE = 'ko-KR';

/** 기본 타임존 설정 */
const DEFAULT_TIMEZONE = 'Asia/Seoul';

/** 기본 RSVP 필드 설정 */
const DEFAULT_RSVP_FIELDS: InvitationRsvpField[] = [
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
];

/** 청첩장 기본 정보 DB 로우 타입 */
type InvitationRow = {
  id: string;
  locale: string;
  time_zone: string;
};

/** 테마 설정 DB 로우 타입 */
type InvitationThemeRow = {
  fonts_serif: string | null;
  fonts_serif_en: string | null;
  fonts_sans: string | null;
  bg_primary: string | null;
  bg_secondary: string | null;
  bg_tertiary: string | null;
  text_primary: string | null;
  text_secondary: string | null;
  text_tertiary: string | null;
  text_muted: string | null;
  accent_rose: string | null;
  accent_rose_dark: string | null;
  accent_rose_light: string | null;
  accent_burgundy: string | null;
  accent_gold: string | null;
  wedding_highlight_text: string | null;
  wedding_highlight_bg: string | null;
  card_bg: string | null;
  card_border: string | null;
  border_light: string | null;
  divider: string | null;
  shadow_soft: string | null;
  shadow_medium: string | null;
  shadow_card: string | null;
  radius_lg: string | null;
  radius_md: string | null;
  radius_sm: string | null;
};

/** 로딩 설정 DB 로우 타입 */
type InvitationLoadingRow = {
  enabled: boolean;
  message: string;
  min_duration: number;
  additional_duration: number;
};

/** 신랑/신부 프로필 DB 로우 타입 */
type InvitationProfileRow = {
  groom_first_name: string;
  groom_last_name: string;
  groom_bio: string | null;
  groom_profile_image: string | null;
  bride_first_name: string;
  bride_last_name: string;
  bride_bio: string | null;
  bride_profile_image: string | null;
};

/** 부모님 정보 DB 로우 타입 */
type InvitationParentsRow = {
  groom_father: string | null;
  groom_mother: string | null;
  bride_father: string | null;
  bride_mother: string | null;
};

/** 예식 정보 DB 로우 타입 */
type InvitationEventRow = {
  date_time: string;
  venue: string;
  address: string;
};

/** 장소 정보 DB 로우 타입 */
type InvitationLocationRow = {
  id: string;
  place_name: string;
  address: string;
  latitude: number | string | null;
  longitude: number | string | null;
  notices: string[] | null;
};

/** 교통편 안내 DB 로우 타입 */
type InvitationTransportationRow = {
  subway: string[] | null;
  bus: string[] | null;
  car: string | null;
  parking: string | null;
};

/** 인사말 DB 로우 타입 */
type InvitationGreetingRow = {
  poetic_note: string | null;
  message_lines: string[];
};

/** 갤러리 설정 DB 로우 타입 */
type InvitationGalleryRow = {
  id: string;
  title: string;
  description: string | null;
  autoplay: boolean;
  autoplay_delay: number | null;
};

/** 갤러리 이미지 DB 로우 타입 */
type InvitationGalleryImageRow = {
  id: string;
  src: string;
  alt: string | null;
  thumbnail: string | null;
  width: number | null;
  height: number | null;
};

/** 계좌 정보 섹션 DB 로우 타입 */
type InvitationAccountsRow = {
  id: string;
  title: string;
  description: string | null;
};

/** 계좌 항목 DB 로우 타입 */
type InvitationAccountEntryRow = {
  id: string;
  group_type: 'groom' | 'bride';
  bank_name: string;
  account_number: string;
  holder: string;
  label: string | null;
};

/** 방명록 설정 DB 로우 타입 */
type InvitationGuestbookRow = {
  id: string;
  privacy_notice: string;
  retention_text: string;
  display_mode: string;
  page_size: number;
  recent_notice: string | null;
  enable_password: boolean;
  enable_edit: boolean;
  enable_delete: boolean;
};

/** 방명록 항목 DB 로우 타입 */
type InvitationGuestbookEntryRow = {
  id: string;
  name: string;
  message: string;
  created_at: string;
  password_hash: string | null;
};

/** RSVP 설정 DB 로우 타입 */
type InvitationRsvpRow = {
  enabled: boolean;
  deadline: string | null;
  consent_title: string | null;
  consent_description: string | null;
  consent_retention: string | null;
  consent_notice: string | null;
};

/** 공유 설정 DB 로우 타입 */
type InvitationShareRow = {
  title: string;
  description: string;
  image_url: string | null;
  kakao_title: string | null;
  kakao_description: string | null;
  kakao_image_url: string | null;
  kakao_button_label: string | null;
};

/** 에셋(이미지) DB 로우 타입 */
type InvitationAssetsRow = {
  hero_image: string | null;
  loading_image: string | null;
  share_og_image: string | null;
  share_kakao_image: string | null;
};

/** BGM 설정 DB 로우 타입 */
type InvitationBgmRow = {
  enabled: boolean;
  audio_url: string | null;
  auto_play: boolean;
  loop: boolean;
};

/** 클로징 문구 DB 로우 타입 */
type InvitationClosingRow = {
  title: string;
  message: string;
  copyright: string | null;
};

/** 섹션 타이틀 DB 로우 타입 */
type InvitationSectionTitlesRow = {
  greeting: string;
  couple: string;
  wedding: string;
  location: string;
  guestbook: string;
  rsvp: string;
  share: string;
};

/**
 * 단일 로우 보장 (없으면 생성)
 * @param supabase Supabase 클라이언트
 * @param table 테이블명
 * @param match 조회 조건
 * @param insertPayload 생성 시 삽입할 데이터
 * @returns 조회 또는 생성된 로우
 */
const ensureSingleRow = async (
  supabase: ReturnType<typeof createSupabaseAdmin>,
  table: string,
  match: Record<string, string>,
  insertPayload: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const { data, error } = await supabase.from(table).select('*').match(match).maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return data as Record<string, unknown>;
  }

  const { data: created, error: insertError } = await supabase
    .from(table)
    .insert(insertPayload)
    .select('*')
    .single();

  if (insertError) {
    throw insertError;
  }

  return created as Record<string, unknown>;
};

/**
 * 청첩장 기본 레코드 조회 또는 생성
 * @returns 청첩장 기본 정보 (id, locale, time_zone)
 */
const getOrCreateInvitation = async () => {
  const supabase = createSupabaseAdmin();
  const { data: existing, error } = await supabase
    .from('invitations')
    .select('id, locale, time_zone')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (existing) {
    return existing as InvitationRow;
  }

  const slug = 'default';
  const { data: created, error: insertError } = await supabase
    .from('invitations')
    .insert({
      slug,
      locale: DEFAULT_LOCALE,
      time_zone: DEFAULT_TIMEZONE,
    })
    .select('id, locale, time_zone')
    .single();

  if (insertError) {
    throw insertError;
  }

  return created as InvitationRow;
};

/**
 * 숫자 파싱 (null/undefined/invalid는 NaN 반환)
 * @param value 파싱할 값
 * @returns 파싱된 숫자 또는 NaN
 */
const parseNumber = (value: number | string | null) => {
  if (value === null || value === undefined) return Number.NaN;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

/**
 * DB 테마 로우를 InvitationTheme 타입으로 매핑
 * @param row DB에서 조회한 테마 로우 (null이면 기본값 사용)
 * @returns InvitationTheme 객체
 */
const mapTheme = (row: InvitationThemeRow | null): InvitationTheme => {
  const fallback = invitationMock.theme;
  if (!row) return fallback;

  return {
    fonts: {
      serif: row.fonts_serif || fallback.fonts.serif,
      serifEn: row.fonts_serif_en || fallback.fonts.serifEn,
      sans: row.fonts_sans || fallback.fonts.sans,
    },
    colors: {
      background: {
        primary: row.bg_primary || fallback.colors.background.primary,
        secondary: row.bg_secondary || fallback.colors.background.secondary,
        tertiary: row.bg_tertiary || fallback.colors.background.tertiary,
      },
      text: {
        primary: row.text_primary || fallback.colors.text.primary,
        secondary: row.text_secondary || fallback.colors.text.secondary,
        tertiary: row.text_tertiary || fallback.colors.text.tertiary,
        muted: row.text_muted || fallback.colors.text.muted,
      },
      accent: {
        rose: row.accent_rose || fallback.colors.accent.rose,
        roseDark: row.accent_rose_dark || fallback.colors.accent.roseDark,
        roseLight: row.accent_rose_light || fallback.colors.accent.roseLight,
        burgundy: row.accent_burgundy || fallback.colors.accent.burgundy,
        gold: row.accent_gold || fallback.colors.accent.gold,
      },
      weddingHighlight: {
        text: row.wedding_highlight_text || fallback.colors.weddingHighlight.text,
        background: row.wedding_highlight_bg || fallback.colors.weddingHighlight.background,
      },
      card: {
        background: row.card_bg || fallback.colors.card.background,
        border: row.card_border || fallback.colors.card.border,
      },
      border: {
        light: row.border_light || fallback.colors.border.light,
        divider: row.divider || fallback.colors.border.divider,
      },
    },
    shadow: {
      soft: row.shadow_soft || fallback.shadow.soft,
      medium: row.shadow_medium || fallback.shadow.medium,
      card: row.shadow_card || fallback.shadow.card,
    },
    radius: {
      lg: row.radius_lg || fallback.radius.lg,
      md: row.radius_md || fallback.radius.md,
      sm: row.radius_sm || fallback.radius.sm,
    },
  };
};

/**
 * 테마 설정 로드
 * @returns 테마 설정 (조회 실패 시 기본값 반환)
 */
export const loadInvitationTheme = async (): Promise<InvitationTheme> => {
  try {
    const supabase = createSupabaseAdmin();
    const invitation = await getOrCreateInvitation();
    const { data: themeRow, error } = await supabase
      .from('invitation_theme')
      .select('*')
      .eq('invitation_id', invitation.id)
      .maybeSingle();
    if (error) {
      return invitationMock.theme;
    }
    return mapTheme(themeRow as InvitationThemeRow | null);
  } catch {
    return invitationMock.theme;
  }
};

/**
 * 퍼블릭 페이지용 청첩장 전체 데이터 로드
 * 서버 컴포넌트에서 호출하여 SSR로 데이터를 미리 로드함
 * @returns 청첩장 전체 데이터 (InvitationMock 타입)
 */
export const loadInvitationView = async (): Promise<InvitationMock> => {
  try {
    const supabase = createSupabaseAdmin();
    const invitation = await getOrCreateInvitation();

    const [
      loading,
      profile,
      parents,
      event,
      location,
      greeting,
      gallery,
      accounts,
      guestbook,
      rsvp,
      share,
      assets,
      bgm,
      closing,
      sectionTitles,
    ] = (await Promise.all([
      ensureSingleRow(supabase, 'invitation_loading', { invitation_id: invitation.id }, { invitation_id: invitation.id }),
      ensureSingleRow(supabase, 'invitation_profile', { invitation_id: invitation.id }, { invitation_id: invitation.id }),
      ensureSingleRow(supabase, 'invitation_parents', { invitation_id: invitation.id }, { invitation_id: invitation.id }),
      ensureSingleRow(supabase, 'invitation_event', { invitation_id: invitation.id }, { invitation_id: invitation.id, date_time: new Date().toISOString() }),
      ensureSingleRow(supabase, 'invitation_location', { invitation_id: invitation.id }, { invitation_id: invitation.id }),
      ensureSingleRow(supabase, 'invitation_greeting', { invitation_id: invitation.id }, { invitation_id: invitation.id }),
      ensureSingleRow(supabase, 'invitation_gallery', { invitation_id: invitation.id }, { invitation_id: invitation.id }),
      ensureSingleRow(supabase, 'invitation_accounts', { invitation_id: invitation.id }, { invitation_id: invitation.id }),
      ensureSingleRow(supabase, 'invitation_guestbook', { invitation_id: invitation.id }, { invitation_id: invitation.id }),
      ensureSingleRow(supabase, 'invitation_rsvp', { invitation_id: invitation.id }, { invitation_id: invitation.id }),
      ensureSingleRow(supabase, 'invitation_share', { invitation_id: invitation.id }, { invitation_id: invitation.id }),
      ensureSingleRow(supabase, 'invitation_assets', { invitation_id: invitation.id }, { invitation_id: invitation.id }),
      ensureSingleRow(supabase, 'invitation_bgm', { invitation_id: invitation.id }, { invitation_id: invitation.id }),
      ensureSingleRow(supabase, 'invitation_closing', { invitation_id: invitation.id }, { invitation_id: invitation.id }),
      ensureSingleRow(supabase, 'invitation_section_titles', { invitation_id: invitation.id }, { invitation_id: invitation.id }),
    ])) as [
      InvitationLoadingRow,
      InvitationProfileRow,
      InvitationParentsRow,
      InvitationEventRow,
      InvitationLocationRow,
      InvitationGreetingRow,
      InvitationGalleryRow,
      InvitationAccountsRow,
      InvitationGuestbookRow,
      InvitationRsvpRow,
      InvitationShareRow,
      InvitationAssetsRow,
      InvitationBgmRow,
      InvitationClosingRow,
      InvitationSectionTitlesRow
    ];

    const transportation = (await ensureSingleRow(
      supabase,
      'invitation_transportation',
      { location_id: location.id },
      { location_id: location.id }
    )) as InvitationTransportationRow;

    const galleryId = gallery.id;
    const accountsId = accounts.id;
    const guestbookId = guestbook.id;

    const { data: galleryImagesRaw } = await supabase
      .from('invitation_gallery_images')
      .select('*')
      .eq('gallery_id', galleryId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    const { data: accountEntriesRaw } = await supabase
      .from('invitation_account_entries')
      .select('*')
      .eq('accounts_id', accountsId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    const { data: guestbookEntriesRaw } = await supabase
      .from('invitation_guestbook_entries')
      .select('*')
      .eq('guestbook_id', guestbookId)
      .order('created_at', { ascending: false });

    const galleryImages = (galleryImagesRaw || []) as InvitationGalleryImageRow[];
    const accountEntries = (accountEntriesRaw || []) as InvitationAccountEntryRow[];
    const guestbookEntries = (guestbookEntriesRaw || []) as InvitationGuestbookEntryRow[];

    const theme = await loadInvitationTheme();

    return {
      meta: {
        locale: invitation.locale || DEFAULT_LOCALE,
        timeZone: invitation.time_zone || DEFAULT_TIMEZONE,
      },
      theme,
      storage: {
        guestbook: { key: `invitation-${invitation.id}-guestbook` },
        rsvp: { key: `invitation-${invitation.id}-rsvp` },
      },
      assets: {
        heroImage: assets.hero_image || '',
        loadingImage: assets.loading_image || '',
        share: {
          ogImage: assets.share_og_image || '',
          kakaoImage: assets.share_kakao_image || '',
        },
      },
      content: {
        loading: {
          enabled: loading.enabled,
          message: loading.message,
          minDuration: loading.min_duration,
          additionalDuration: loading.additional_duration,
        },
        event: {
          dateTime: event.date_time,
          venue: event.venue,
          address: event.address,
        },
        greeting: {
          message: greeting.message_lines || [],
          poeticNote: greeting.poetic_note || '',
        },
        couple: {
          groom: {
            firstName: profile.groom_first_name,
            lastName: profile.groom_last_name,
            bio: profile.groom_bio || '',
            profileImage: profile.groom_profile_image || '',
          },
          bride: {
            firstName: profile.bride_first_name,
            lastName: profile.bride_last_name,
            bio: profile.bride_bio || '',
            profileImage: profile.bride_profile_image || '',
          },
          parents: {
            groom: {
              father: parents.groom_father || '',
              mother: parents.groom_mother || '',
            },
            bride: {
              father: parents.bride_father || '',
              mother: parents.bride_mother || '',
            },
          },
        },
        location: {
          placeName: location.place_name,
          coordinates: {
            lat: parseNumber(location.latitude),
            lng: parseNumber(location.longitude),
          },
          transportation: {
            subway: transportation.subway || [],
            bus: transportation.bus || [],
            car: transportation.car || '',
            parking: transportation.parking || '',
          },
          notices: location.notices || [],
        },
        gallery: {
          title: gallery.title,
          description: gallery.description || '',
          images: galleryImages.map((image) => ({
            id: image.id,
            src: image.src,
            alt: image.alt || '',
            thumbnail: image.thumbnail || undefined,
            width: image.width || undefined,
            height: image.height || undefined,
          })),
          autoplay: gallery.autoplay,
          autoplayDelay: gallery.autoplay_delay ?? undefined,
        },
        share: {
          title: share.title,
          description: share.description,
          imageUrl: share.image_url || assets.share_og_image || '',
          kakaoTemplate: {
            title: share.kakao_title || share.title,
            description: share.kakao_description || share.description,
            imageUrl: share.kakao_image_url || assets.share_kakao_image || share.image_url || '',
            buttonLabel: share.kakao_button_label || '청첩장 보기',
          },
        },
        rsvp: {
          enabled: rsvp.enabled,
          deadline: rsvp.deadline || '',
          fields: DEFAULT_RSVP_FIELDS,
          consent: {
            title: rsvp.consent_title || '',
            description: rsvp.consent_description || '',
            retention: rsvp.consent_retention || '',
            notice: rsvp.consent_notice || '',
          },
        },
        rsvpResponses: [],
        guestbook: {
          privacyNotice: guestbook.privacy_notice,
          retentionText: guestbook.retention_text,
          mockEntries: guestbookEntries.map((entry) => ({
            id: entry.id,
            name: entry.name,
            message: entry.message,
            createdAt: entry.created_at,
            passwordHash: entry.password_hash || undefined,
          })),
          displayMode: guestbook.display_mode === 'paginated' ? 'paginated' : 'recent',
          pageSize: guestbook.page_size,
          recentNotice: guestbook.recent_notice || '',
          enablePassword: guestbook.enable_password,
          enableEdit: guestbook.enable_edit,
          enableDelete: guestbook.enable_delete,
        },
        accounts: {
          title: accounts.title,
          description: accounts.description || '',
          groom: accountEntries
            .filter((entry) => entry.group_type === 'groom')
            .map((entry) => ({
              bankName: entry.bank_name,
              accountNumber: entry.account_number,
              holder: entry.holder,
              label: entry.label || '',
            })),
          bride: accountEntries
            .filter((entry) => entry.group_type === 'bride')
            .map((entry) => ({
              bankName: entry.bank_name,
              accountNumber: entry.account_number,
              holder: entry.holder,
              label: entry.label || '',
            })),
        },
        bgm: {
          enabled: bgm.enabled,
          audioUrl: bgm.audio_url || '',
          autoPlay: bgm.auto_play,
          loop: bgm.loop,
        },
        closing: {
          title: closing.title,
          message: closing.message,
          copyright: closing.copyright || '',
        },
        sectionTitles: {
          greeting: sectionTitles.greeting,
          couple: sectionTitles.couple,
          wedding: sectionTitles.wedding,
          location: sectionTitles.location,
          guestbook: sectionTitles.guestbook,
          rsvp: sectionTitles.rsvp,
          share: sectionTitles.share,
        },
      },
    };
  } catch {
    return invitationMock;
  }
};


/** OG 메타데이터 타입 */
export type OgMetadata = {
  title: string;
  description: string;
  imageUrl: string | null;
};

/**
 * OG 메타데이터 로드 (카카오톡 공유용)
 * layout.tsx의 generateMetadata에서 호출
 * @returns OG 메타데이터 (title, description, imageUrl)
 */
export const loadOgMetadata = async (): Promise<OgMetadata> => {
  const defaultMeta: OgMetadata = {
    title: '결혼식에 초대합니다',
    description: '소중한 분들을 초대합니다',
    imageUrl: null,
  };

  try {
    const supabase = createSupabaseAdmin();
    const invitation = await getOrCreateInvitation();

    const [shareResult, assetsResult] = await Promise.all([
      supabase
        .from('invitation_share')
        .select('title, description, image_url')
        .eq('invitation_id', invitation.id)
        .maybeSingle(),
      supabase
        .from('invitation_assets')
        .select('share_og_image')
        .eq('invitation_id', invitation.id)
        .maybeSingle(),
    ]);

    const share = shareResult.data as InvitationShareRow | null;
    const assets = assetsResult.data as Pick<InvitationAssetsRow, 'share_og_image'> | null;

    return {
      title: share?.title || defaultMeta.title,
      description: share?.description || defaultMeta.description,
      imageUrl: share?.image_url || assets?.share_og_image || null,
    };
  } catch {
    return defaultMeta;
  }
};
