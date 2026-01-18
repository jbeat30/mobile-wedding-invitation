import { invitationMock } from '@/mock/invitation.mock';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';

const DEFAULT_LOCALE = 'ko-KR';
const DEFAULT_TIMEZONE = 'Asia/Seoul';

type ProfileRow = {
  id: string;
  groom_full_name: string;
  groom_last_name: string;
  groom_bio: string | null;
  groom_profile_image: string | null;
  groom_role: string | null;
  bride_full_name: string;
  bride_last_name: string;
  bride_bio: string | null;
  bride_profile_image: string | null;
  bride_role: string | null;
  wedding_date_time: string;
  venue: string;
  address: string;
};

type EventRow = {
  id: string;
  title: string;
  date_time: string;
  date_text: string;
  venue: string;
  address: string;
};

type EventGuidanceRow = {
  id: string;
  event_id: string;
  directions: string[];
  notices: string[];
};

type IntroRow = {
  id: string;
  quote: string;
  sub_quote: string | null;
  theme_dark_background: string;
  theme_light_background: string;
  theme_text_color: string;
  theme_accent_color: string;
};

type ThemeRow = {
  id: string;
  fonts_serif: string;
  fonts_serif_en: string;
  fonts_sans: string;
  bg_primary: string;
  bg_secondary: string;
  bg_tertiary: string;
  text_primary: string;
  text_secondary: string;
  text_tertiary: string;
  text_muted: string;
  accent_rose: string;
  accent_rose_dark: string;
  accent_rose_light: string;
  accent_burgundy: string;
  accent_gold: string;
  wedding_highlight_text: string;
  wedding_highlight_bg: string;
  card_bg: string;
  card_border: string;
  border_light: string;
  divider: string;
  shadow_soft: string;
  shadow_medium: string;
  shadow_card: string;
  radius_lg: string;
  radius_md: string;
  radius_sm: string;
};

type AssetsRow = {
  id: string;
  hero_image: string;
  loading_image: string;
  share_og_image: string;
  share_kakao_image: string;
};

type GreetingRow = {
  id: string;
  poetic_note: string | null;
  message_lines: string[];
};

type ShareRow = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  kakao_title: string | null;
  kakao_description: string | null;
  kakao_image_url: string | null;
  kakao_button_label: string | null;
};

type BgmRow = {
  id: string;
  enabled: boolean;
  title: string | null;
  audio_url: string | null;
  auto_play: boolean;
  loop: boolean;
};

type GalleryRow = {
  id: string;
  title: string;
  description: string | null;
  autoplay: boolean | null;
  autoplay_delay: number | null;
};

type GalleryImageRow = {
  id: string;
  gallery_id: string;
  src: string;
  alt: string;
  thumbnail: string | null;
  width: number | null;
  height: number | null;
  sort_order: number | null;
};

type LoadingRow = {
  id: string;
  enabled: boolean;
  message: string;
  min_duration: number;
  additional_duration: number;
};

type LocationRow = {
  id: string;
  place_name: string;
  address: string;
  latitude: number;
  longitude: number;
  navigation_naver_web: string | null;
  navigation_kakao_web: string | null;
  navigation_tmap_web: string | null;
  notices: string[];
};

type TransportationRow = {
  id: string;
  location_id: string;
  subway: string[];
  bus: string[];
  car: string | null;
  parking: string | null;
};

type GuestbookRow = {
  id: string;
  privacy_notice: string;
  retention_text: string;
  display_mode: string;
  page_size: number;
  recent_notice: string;
  enable_password: boolean;
  enable_edit: boolean;
  enable_delete: boolean;
};

type RsvpRow = {
  id: string;
  enabled: boolean;
  deadline: string | null;
  consent_title: string;
  consent_description: string;
  consent_retention: string;
  consent_notice: string;
};

type RsvpFieldRow = {
  id: string;
  rsvp_id: string;
  field_key: string;
  label: string;
  required: boolean;
  placeholder: string | null;
  options: string[];
  sort_order: number | null;
};

type AccountsRow = {
  id: string;
  title: string;
  description: string;
};

type AccountEntryRow = {
  id: string;
  accounts_id: string;
  group_type: string;
  bank_name: string;
  account_number: string;
  holder: string;
};

type FamilyLineRow = {
  id: string;
  subject: string;
  relationship_label: string;
};

type FamilyMemberRow = {
  id: string;
  family_line_id: string;
  role: string;
  name: string;
  prefix: string | null;
  suffix: string | null;
};

type ClosingRow = {
  id: string;
  message: string;
  signature: string | null;
  copyright: string | null;
};

/**
 * 초대장 기본 레코드 확보
 * @returns Promise<{ id: string }>
 */
export const getOrCreateInvitation = async () => {
  const supabase = createSupabaseAdmin();
  const { data: existing, error } = await supabase
    .from('invitations')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (existing) {
    return existing;
  }

  const slug = 'default';
  const { data: created, error: insertError } = await supabase
    .from('invitations')
    .insert({
      slug,
      locale: DEFAULT_LOCALE,
      time_zone: DEFAULT_TIMEZONE,
    })
    .select('id')
    .single();

  if (insertError) {
    throw insertError;
  }

  return created;
};

/**
 * 테이블 단일 레코드 확보
 * @param table string
 * @param invitationId string
 * @param defaults Record<string, unknown>
 * @returns Promise<Record<string, unknown>>
 */
export const ensureSingleRow = async (
  table: string,
  invitationId: string,
  defaults: Record<string, unknown>
) => {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('invitation_id', invitationId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return data as Record<string, unknown>;
  }

  const { data: created, error: insertError } = await supabase
    .from(table)
    .insert({ invitation_id: invitationId, ...defaults })
    .select('*')
    .single();

  if (insertError) {
    throw insertError;
  }

  return created as Record<string, unknown>;
};

/**
 * 상위 키 기반 단일 레코드 확보
 * @param table string
 * @param column string
 * @param value string
 * @param defaults Record<string, unknown>
 * @returns Promise<Record<string, unknown>>
 */
export const ensureChildRow = async (
  table: string,
  column: string,
  value: string,
  defaults: Record<string, unknown>
) => {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from(table).select('*').eq(column, value).maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return data as Record<string, unknown>;
  }

  const { data: created, error: insertError } = await supabase
    .from(table)
    .insert({ [column]: value, ...defaults })
    .select('*')
    .single();

  if (insertError) {
    throw insertError;
  }

  return created as Record<string, unknown>;
};

/**
 * 관리자 데이터 로드
 * @returns Promise<Record<string, unknown>>
 */
export const loadAdminData = async () => {
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();
  const { content, assets, theme } = invitationMock;

  const profile = (await ensureSingleRow('invitation_profile', id, {
    groom_full_name: content.couple.groom.fullName,
    groom_last_name: content.couple.groom.lastName,
    groom_bio: content.couple.groom.bio || '',
    groom_profile_image: content.couple.groom.profileImage || '',
    groom_role: content.couple.groom.role || '',
    bride_full_name: content.couple.bride.fullName,
    bride_last_name: content.couple.bride.lastName,
    bride_bio: content.couple.bride.bio || '',
    bride_profile_image: content.couple.bride.profileImage || '',
    bride_role: content.couple.bride.role || '',
    wedding_date_time: content.event.dateTime,
    venue: content.event.venue,
    address: content.event.address,
  })) as ProfileRow;

  const event = (await ensureSingleRow('invitation_event', id, {
    title: content.event.title,
    date_time: content.event.dateTime,
    date_text: content.event.dateText,
    venue: content.event.venue,
    address: content.event.address,
  })) as EventRow;

  const eventGuidance = (await ensureChildRow('invitation_event_guidance', 'event_id', event.id, {
    directions: content.event.guidance.directions || [],
    notices: content.event.guidance.notices || [],
  })) as EventGuidanceRow;

  const intro = (await ensureSingleRow('invitation_intro', id, {
    quote: content.intro.quote,
    sub_quote: content.intro.subQuote || '',
    theme_dark_background: content.intro.theme.darkBackground,
    theme_light_background: content.intro.theme.lightBackground,
    theme_text_color: content.intro.theme.textColor,
    theme_accent_color: content.intro.theme.accentColor,
  })) as IntroRow;

  const themeRow = (await ensureSingleRow('invitation_theme', id, {
    fonts_serif: theme.fonts.serif,
    fonts_serif_en: theme.fonts.serifEn,
    fonts_sans: theme.fonts.sans,
    bg_primary: theme.colors.background.primary,
    bg_secondary: theme.colors.background.secondary,
    bg_tertiary: theme.colors.background.tertiary,
    text_primary: theme.colors.text.primary,
    text_secondary: theme.colors.text.secondary,
    text_tertiary: theme.colors.text.tertiary,
    text_muted: theme.colors.text.muted,
    accent_rose: theme.colors.accent.rose,
    accent_rose_dark: theme.colors.accent.roseDark,
    accent_rose_light: theme.colors.accent.roseLight,
    accent_burgundy: theme.colors.accent.burgundy,
    accent_gold: theme.colors.accent.gold,
    wedding_highlight_text: theme.colors.weddingHighlight.text,
    wedding_highlight_bg: theme.colors.weddingHighlight.background,
    card_bg: theme.colors.card.background,
    card_border: theme.colors.card.border,
    border_light: theme.colors.border.light,
    divider: theme.colors.border.divider,
    shadow_soft: theme.shadow.soft,
    shadow_medium: theme.shadow.medium,
    shadow_card: theme.shadow.card,
    radius_lg: theme.radius.lg,
    radius_md: theme.radius.md,
    radius_sm: theme.radius.sm,
  })) as ThemeRow;

  const assetsRow = (await ensureSingleRow('invitation_assets', id, {
    hero_image: assets.heroImage,
    loading_image: assets.loadingImage,
    share_og_image: assets.share.ogImage,
    share_kakao_image: assets.share.kakaoImage,
  })) as AssetsRow;

  const greeting = (await ensureSingleRow('invitation_greeting', id, {
    poetic_note: content.greeting.poeticNote || '',
    message_lines: content.greeting.message,
  })) as GreetingRow;

  const share = (await ensureSingleRow('invitation_share', id, {
    title: content.share.title,
    description: content.share.description,
    image_url: content.share.imageUrl,
    kakao_title: content.share.kakaoTemplate?.title || '',
    kakao_description: content.share.kakaoTemplate?.description || '',
    kakao_image_url: content.share.kakaoTemplate?.imageUrl || '',
    kakao_button_label: content.share.kakaoTemplate?.buttonLabel || '',
  })) as ShareRow;

  const bgm = (await ensureSingleRow('invitation_bgm', id, {
    enabled: false,
    title: '',
    audio_url: '',
    auto_play: false,
    loop: true,
  })) as BgmRow;

  const gallery = (await ensureSingleRow('invitation_gallery', id, {
    title: content.gallery.title,
    description: content.gallery.description || '',
    autoplay: !!content.gallery.autoplay,
    autoplay_delay: content.gallery.autoplayDelay || null,
  })) as GalleryRow;

  let { data: galleryImages } = await supabase
    .from('invitation_gallery_image')
    .select('*')
    .eq('gallery_id', gallery.id)
    .order('sort_order', { ascending: true });

  if (!galleryImages?.length && content.gallery.images.length) {
    const images = content.gallery.images.map((image, index) => ({
      gallery_id: gallery.id,
      src: image.src,
      alt: image.alt,
      thumbnail: image.thumbnail || null,
      width: image.width || null,
      height: image.height || null,
      sort_order: index + 1,
    }));
    const { data: inserted } = await supabase
      .from('invitation_gallery_image')
      .insert(images)
      .select('*');
    galleryImages = (inserted || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }

  const loading = (await ensureSingleRow('invitation_loading', id, {
    enabled: content.loading.enabled,
    message: content.loading.message,
    min_duration: content.loading.minDuration,
    additional_duration: content.loading.additionalDuration,
  })) as LoadingRow;

  const location = (await ensureSingleRow('invitation_location', id, {
    place_name: content.location.placeName,
    address: content.event.address,
    latitude: content.location.coordinates.lat,
    longitude: content.location.coordinates.lng,
    navigation_naver_web: content.location.navigation?.naver?.web || '',
    navigation_kakao_web: content.location.navigation?.kakao?.web || '',
    navigation_tmap_web: content.location.navigation?.tmap?.web || '',
    notices: content.location.notices || [],
  })) as LocationRow;

  const transportation = (await ensureChildRow(
    'invitation_transportation',
    'location_id',
    location.id,
    {
      subway: content.location.transportation.subway || [],
      bus: content.location.transportation.bus || [],
      car: content.location.transportation.car || '',
      parking: content.location.transportation.parking || '',
    }
  )) as TransportationRow;

  const guestbook = (await ensureSingleRow('invitation_guestbook', id, {
    privacy_notice: content.guestbook.privacyNotice,
    retention_text: content.guestbook.retentionText,
    display_mode: content.guestbook.displayMode,
    page_size: content.guestbook.pageSize,
    recent_notice: content.guestbook.recentNotice,
    enable_password: content.guestbook.enablePassword,
    enable_edit: content.guestbook.enableEdit,
    enable_delete: content.guestbook.enableDelete,
  })) as GuestbookRow;

  const rsvp = (await ensureSingleRow('invitation_rsvp', id, {
    enabled: content.rsvp.enabled,
    deadline: content.rsvp.deadline,
    consent_title: content.rsvp.consent.title,
    consent_description: content.rsvp.consent.description,
    consent_retention: content.rsvp.consent.retention,
    consent_notice: content.rsvp.consent.notice,
  })) as RsvpRow;

  let { data: rsvpFields } = await supabase
    .from('invitation_rsvp_field')
    .select('*')
    .eq('rsvp_id', rsvp.id)
    .order('sort_order', { ascending: true });

  if (!rsvpFields?.length && content.rsvp.fields.length) {
    const fieldRows = content.rsvp.fields.map((field, index) => ({
      rsvp_id: rsvp.id,
      field_key: field.key,
      label: field.label,
      required: field.required,
      placeholder: field.placeholder || '',
      options: field.options || [],
      sort_order: index + 1,
    }));
    const { data: inserted } = await supabase
      .from('invitation_rsvp_field')
      .insert(fieldRows)
      .select('*');
    rsvpFields = (inserted || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }

  const accounts = (await ensureSingleRow('invitation_accounts', id, {
    title: content.accounts.title,
    description: content.accounts.description,
  })) as AccountsRow;

  let { data: accountEntries } = await supabase
    .from('invitation_account_entry')
    .select('*')
    .eq('accounts_id', accounts.id);

  if (!accountEntries?.length) {
    const entries = [
      ...content.accounts.groom.map((account) => ({
        accounts_id: accounts.id,
        group_type: 'groom',
        bank_name: account.bankName,
        account_number: account.accountNumber,
        holder: account.holder,
      })),
      ...content.accounts.bride.map((account) => ({
        accounts_id: accounts.id,
        group_type: 'bride',
        bank_name: account.bankName,
        account_number: account.accountNumber,
        holder: account.holder,
      })),
    ];

    if (entries.length) {
      const { data: inserted } = await supabase
        .from('invitation_account_entry')
        .insert(entries)
        .select('*');
      accountEntries = inserted || [];
    }
  }

  let { data: familyLines } = await supabase
    .from('invitation_family_line')
    .select('*')
    .eq('invitation_id', id);

  if (!familyLines?.length && content.couple.familyLines?.length) {
    const lineRows = content.couple.familyLines.map((line) => ({
      invitation_id: id,
      subject: line.subject,
      relationship_label: line.relationshipLabel,
    }));
    const { data: inserted } = await supabase
      .from('invitation_family_line')
      .insert(lineRows)
      .select('*');
    familyLines = inserted || [];
  }

  const familyLineIds = (familyLines || []).map((line) => line.id);
  let familyMembers: FamilyMemberRow[] = [];
  if (familyLineIds.length) {
    const { data } = await supabase
      .from('invitation_family_member')
      .select('*')
      .in('family_line_id', familyLineIds);
    familyMembers = (data as FamilyMemberRow[]) || [];
  }

  if (!familyMembers.length && familyLines?.length && content.couple.familyLines?.length) {
    const memberRows = familyLines.flatMap((line) => {
      const match = content.couple.familyLines?.find(
        (item) => item.subject === line.subject && item.relationshipLabel === line.relationship_label
      );
      if (!match) return [];
      return match.members.map((member) => ({
        family_line_id: line.id,
        role: member.role,
        name: member.name,
        prefix: member.prefix || '',
        suffix: member.suffix || '',
      }));
    });

    if (memberRows.length) {
      const { data } = await supabase
        .from('invitation_family_member')
        .insert(memberRows)
        .select('*');
      familyMembers = (data as FamilyMemberRow[]) || [];
    }
  }

  const closing = (await ensureSingleRow('invitation_closing', id, {
    message: content.closing.message,
    signature: content.closing.signature || '',
    copyright: content.closing.copyright || '',
  })) as ClosingRow;

  return {
    invitationId: id,
    loading,
    profile,
    event,
    eventGuidance,
    intro,
    theme: themeRow,
    assets: assetsRow,
    greeting,
    share,
    bgm,
    gallery,
    galleryImages: (galleryImages || []) as GalleryImageRow[],
    location,
    transportation,
    guestbook,
    rsvp,
    rsvpFields: (rsvpFields || []) as RsvpFieldRow[],
    accounts,
    accountEntries: (accountEntries || []) as AccountEntryRow[],
    familyLines: (familyLines || []) as FamilyLineRow[],
    familyMembers,
    closing,
  };
};

export type AdminDashboardData = Awaited<ReturnType<typeof loadAdminData>>;
