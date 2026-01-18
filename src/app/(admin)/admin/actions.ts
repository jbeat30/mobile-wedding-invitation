'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import {
  clearAuthCookies,
  createAccessToken,
  createRefreshToken,
  getRefreshTokenCookie,
  hashRefreshToken,
  requireAdminAuth,
  setAuthCookies,
} from '@/lib/adminAuth';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';

const ADMIN_PATH = '/admin';

/**
 * 줄 단위 배열 파싱
 * @param value string
 * @returns string[]
 */
const parseLines = (value: string) => {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

/**
 * 숫자 변환
 * @param value FormDataEntryValue | null
 * @param fallback number
 * @returns number
 */
const toNumber = (value: FormDataEntryValue | null, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * 관리자 화면 갱신
 * @returns void
 */
const revalidateAdmin = () => {
  revalidatePath(ADMIN_PATH);
};

/**
 * 로그인 처리
 * @param prevState string | null
 * @param formData FormData
 * @returns Promise<string | void>
 */
export const loginAction = async (prevState: string | null, formData: FormData) => {
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '').trim();

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, username, password_hash, role, is_active')
    .eq('username', username)
    .maybeSingle();

  if (error || !data || !data.is_active) {
    return '아이디 또는 비밀번호가 올바르지 않습니다';
  }

  const isMatch = await bcrypt.compare(password, data.password_hash);
  if (!isMatch) {
    return '아이디 또는 비밀번호가 올바르지 않습니다';
  }

  const accessToken = await createAccessToken({
    sub: data.id,
    username: data.username,
    role: data.role,
  });
  const refreshToken = createRefreshToken();

  await supabase.from('admin_users').update({ last_login_at: new Date().toISOString() }).eq('id', data.id);
  await supabase.from('admin_refresh_tokens').insert({
    admin_user_id: data.id,
    token_hash: refreshToken.hash,
    expires_at: refreshToken.expiresAt.toISOString(),
  });

  await setAuthCookies({
    accessToken,
    refreshToken: refreshToken.token,
    refreshExpiresAt: refreshToken.expiresAt,
  });

  redirect('/admin');
};

/**
 * 로그아웃 처리
 * @returns Promise<void>
 */
export const logoutAction = async () => {
  const supabase = createSupabaseAdmin();
  const refreshToken = await getRefreshTokenCookie();

  if (refreshToken) {
    const tokenHash = hashRefreshToken(refreshToken);
    await supabase
      .from('admin_refresh_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('token_hash', tokenHash);
  }

  await clearAuthCookies();
  redirect('/admin/login');
};

/**
 * 관리자 세션 체크
 * @returns Promise<void>
 */
export const requireAdminSession = async () => {
  const supabase = createSupabaseAdmin();
  await requireAdminAuth(supabase);
};

/**
 * 기본 정보 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateProfileAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    groom_full_name: String(formData.get('groom_full_name') || ''),
    groom_last_name: String(formData.get('groom_last_name') || ''),
    groom_bio: String(formData.get('groom_bio') || ''),
    groom_profile_image: String(formData.get('groom_profile_image') || ''),
    groom_role: String(formData.get('groom_role') || ''),
    bride_full_name: String(formData.get('bride_full_name') || ''),
    bride_last_name: String(formData.get('bride_last_name') || ''),
    bride_bio: String(formData.get('bride_bio') || ''),
    bride_profile_image: String(formData.get('bride_profile_image') || ''),
    bride_role: String(formData.get('bride_role') || ''),
    wedding_date_time: String(formData.get('wedding_date_time') || ''),
    venue: String(formData.get('venue') || ''),
    address: String(formData.get('address') || ''),
  };

  await supabase
    .from('invitation_profile')
    .update(payload)
    .eq('invitation_id', id);

  await supabase
    .from('invitation_event')
    .update({
      title: String(formData.get('event_title') || ''),
      date_time: String(formData.get('wedding_date_time') || ''),
      date_text: String(formData.get('event_date_text') || ''),
      venue: payload.venue,
      address: payload.address,
    })
    .eq('invitation_id', id);

  revalidateAdmin();
};

/**
 * 로딩 설정 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateLoadingAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    enabled: formData.get('loading_enabled') === 'on',
    message: String(formData.get('loading_message') || ''),
    min_duration: toNumber(formData.get('loading_min_duration')),
    additional_duration: toNumber(formData.get('loading_additional_duration')),
  };

  await supabase.from('invitation_loading').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};

/**
 * 인트로 설정 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateIntroAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    quote: String(formData.get('intro_quote') || ''),
    sub_quote: String(formData.get('intro_sub_quote') || ''),
    theme_dark_background: String(formData.get('intro_theme_dark_background') || ''),
    theme_light_background: String(formData.get('intro_theme_light_background') || ''),
    theme_text_color: String(formData.get('intro_theme_text_color') || ''),
    theme_accent_color: String(formData.get('intro_theme_accent_color') || ''),
  };

  await supabase.from('invitation_intro').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};

/**
 * 행사 안내 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateEventGuidanceAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const eventId = String(formData.get('event_id') || '');

  const payload = {
    directions: parseLines(String(formData.get('event_directions') || '')),
    notices: parseLines(String(formData.get('event_notices') || '')),
  };

  await supabase.from('invitation_event_guidance').update(payload).eq('event_id', eventId);
  revalidateAdmin();
};

/**
 * 위치 안내 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateLocationAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    place_name: String(formData.get('location_place_name') || ''),
    address: String(formData.get('location_address') || ''),
    latitude: toNumber(formData.get('location_latitude')),
    longitude: toNumber(formData.get('location_longitude')),
    navigation_naver_web: String(formData.get('location_nav_naver') || ''),
    navigation_kakao_web: String(formData.get('location_nav_kakao') || ''),
    navigation_tmap_web: String(formData.get('location_nav_tmap') || ''),
    notices: parseLines(String(formData.get('location_notices') || '')),
  };

  await supabase.from('invitation_location').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};

/**
 * 교통 안내 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateTransportationAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const locationId = String(formData.get('location_id') || '');

  const payload = {
    subway: parseLines(String(formData.get('transport_subway') || '')),
    bus: parseLines(String(formData.get('transport_bus') || '')),
    car: String(formData.get('transport_car') || ''),
    parking: String(formData.get('transport_parking') || ''),
  };

  await supabase.from('invitation_transportation').update(payload).eq('location_id', locationId);
  revalidateAdmin();
};

/**
 * 테마 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateThemeAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    fonts_serif: String(formData.get('fonts_serif') || ''),
    fonts_serif_en: String(formData.get('fonts_serif_en') || ''),
    fonts_sans: String(formData.get('fonts_sans') || ''),
    bg_primary: String(formData.get('bg_primary') || ''),
    bg_secondary: String(formData.get('bg_secondary') || ''),
    bg_tertiary: String(formData.get('bg_tertiary') || ''),
    text_primary: String(formData.get('text_primary') || ''),
    text_secondary: String(formData.get('text_secondary') || ''),
    text_tertiary: String(formData.get('text_tertiary') || ''),
    text_muted: String(formData.get('text_muted') || ''),
    accent_rose: String(formData.get('accent_rose') || ''),
    accent_rose_dark: String(formData.get('accent_rose_dark') || ''),
    accent_rose_light: String(formData.get('accent_rose_light') || ''),
    accent_burgundy: String(formData.get('accent_burgundy') || ''),
    accent_gold: String(formData.get('accent_gold') || ''),
    wedding_highlight_text: String(formData.get('wedding_highlight_text') || ''),
    wedding_highlight_bg: String(formData.get('wedding_highlight_bg') || ''),
    card_bg: String(formData.get('card_bg') || ''),
    card_border: String(formData.get('card_border') || ''),
    border_light: String(formData.get('border_light') || ''),
    divider: String(formData.get('divider') || ''),
    shadow_soft: String(formData.get('shadow_soft') || ''),
    shadow_medium: String(formData.get('shadow_medium') || ''),
    shadow_card: String(formData.get('shadow_card') || ''),
    radius_lg: String(formData.get('radius_lg') || ''),
    radius_md: String(formData.get('radius_md') || ''),
    radius_sm: String(formData.get('radius_sm') || ''),
  };

  await supabase.from('invitation_theme').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};

/**
 * 에셋 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateAssetsAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    hero_image: String(formData.get('hero_image') || ''),
    loading_image: String(formData.get('loading_image') || ''),
    share_og_image: String(formData.get('share_og_image') || ''),
    share_kakao_image: String(formData.get('share_kakao_image') || ''),
  };

  await supabase.from('invitation_assets').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};

/**
 * 인사말 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateGreetingAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const lines = String(formData.get('message_lines') || '')
    .split('\n')
    .map((line) => line.trimEnd());

  await supabase
    .from('invitation_greeting')
    .update({
      poetic_note: String(formData.get('poetic_note') || ''),
      message_lines: lines,
    })
    .eq('invitation_id', id);

  revalidateAdmin();
};

/**
 * 공유 설정 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateShareAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    title: String(formData.get('share_title') || ''),
    description: String(formData.get('share_description') || ''),
    image_url: String(formData.get('share_image_url') || ''),
    kakao_title: String(formData.get('kakao_title') || ''),
    kakao_description: String(formData.get('kakao_description') || ''),
    kakao_image_url: String(formData.get('kakao_image_url') || ''),
    kakao_button_label: String(formData.get('kakao_button_label') || ''),
  };

  await supabase.from('invitation_share').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};

/**
 * BGM 설정 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateBgmAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    enabled: formData.get('bgm_enabled') === 'on',
    title: String(formData.get('bgm_title') || ''),
    audio_url: String(formData.get('bgm_audio_url') || ''),
    auto_play: formData.get('bgm_auto_play') === 'on',
    loop: formData.get('bgm_loop') === 'on',
  };

  await supabase.from('invitation_bgm').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};

/**
 * 방명록 설정 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateGuestbookAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    privacy_notice: String(formData.get('guestbook_privacy_notice') || ''),
    retention_text: String(formData.get('guestbook_retention_text') || ''),
    display_mode: String(formData.get('guestbook_display_mode') || 'recent'),
    page_size: toNumber(formData.get('guestbook_page_size'), 5),
    recent_notice: String(formData.get('guestbook_recent_notice') || ''),
    enable_password: formData.get('guestbook_enable_password') === 'on',
    enable_edit: formData.get('guestbook_enable_edit') === 'on',
    enable_delete: formData.get('guestbook_enable_delete') === 'on',
  };

  await supabase.from('invitation_guestbook').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};

/**
 * RSVP 설정 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateRsvpAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();
  const deadlineValue = String(formData.get('rsvp_deadline') || '').trim();

  const payload = {
    enabled: formData.get('rsvp_enabled') === 'on',
    deadline: deadlineValue ? deadlineValue : null,
    consent_title: String(formData.get('rsvp_consent_title') || ''),
    consent_description: String(formData.get('rsvp_consent_description') || ''),
    consent_retention: String(formData.get('rsvp_consent_retention') || ''),
    consent_notice: String(formData.get('rsvp_consent_notice') || ''),
  };

  await supabase.from('invitation_rsvp').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};

/**
 * RSVP 필드 추가
 * @param formData FormData
 * @returns Promise<void>
 */
export const addRsvpFieldAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const rsvpId = String(formData.get('rsvp_id') || '');

  const payload = {
    rsvp_id: rsvpId,
    field_key: String(formData.get('rsvp_field_key') || ''),
    label: String(formData.get('rsvp_field_label') || ''),
    required: formData.get('rsvp_field_required') === 'on',
    placeholder: String(formData.get('rsvp_field_placeholder') || ''),
    options: parseLines(String(formData.get('rsvp_field_options') || '')),
    sort_order: toNumber(formData.get('rsvp_field_sort_order')),
  };

  await supabase.from('invitation_rsvp_field').insert(payload);
  revalidateAdmin();
};

/**
 * RSVP 필드 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateRsvpFieldAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const fieldId = String(formData.get('rsvp_field_id') || '');

  const payload = {
    field_key: String(formData.get('rsvp_field_key') || ''),
    label: String(formData.get('rsvp_field_label') || ''),
    required: formData.get('rsvp_field_required') === 'on',
    placeholder: String(formData.get('rsvp_field_placeholder') || ''),
    options: parseLines(String(formData.get('rsvp_field_options') || '')),
    sort_order: toNumber(formData.get('rsvp_field_sort_order')),
  };

  await supabase.from('invitation_rsvp_field').update(payload).eq('id', fieldId);
  revalidateAdmin();
};

/**
 * RSVP 필드 삭제
 * @param formData FormData
 * @returns Promise<void>
 */
export const deleteRsvpFieldAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const fieldId = String(formData.get('rsvp_field_id') || '');
  await supabase.from('invitation_rsvp_field').delete().eq('id', fieldId);
  revalidateAdmin();
};

/**
 * 계좌 정보 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateAccountsAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    title: String(formData.get('accounts_title') || ''),
    description: String(formData.get('accounts_description') || ''),
  };

  await supabase.from('invitation_accounts').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};

/**
 * 계좌 항목 추가
 * @param formData FormData
 * @returns Promise<void>
 */
export const addAccountEntryAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const accountsId = String(formData.get('accounts_id') || '');

  const payload = {
    accounts_id: accountsId,
    group_type: String(formData.get('account_group_type') || ''),
    bank_name: String(formData.get('account_bank_name') || ''),
    account_number: String(formData.get('account_number') || ''),
    holder: String(formData.get('account_holder') || ''),
  };

  await supabase.from('invitation_account_entry').insert(payload);
  revalidateAdmin();
};

/**
 * 계좌 항목 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateAccountEntryAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const entryId = String(formData.get('account_entry_id') || '');

  const payload = {
    group_type: String(formData.get('account_group_type') || ''),
    bank_name: String(formData.get('account_bank_name') || ''),
    account_number: String(formData.get('account_number') || ''),
    holder: String(formData.get('account_holder') || ''),
  };

  await supabase.from('invitation_account_entry').update(payload).eq('id', entryId);
  revalidateAdmin();
};

/**
 * 계좌 항목 삭제
 * @param formData FormData
 * @returns Promise<void>
 */
export const deleteAccountEntryAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const entryId = String(formData.get('account_entry_id') || '');
  await supabase.from('invitation_account_entry').delete().eq('id', entryId);
  revalidateAdmin();
};

/**
 * 가족 라인 추가
 * @param formData FormData
 * @returns Promise<void>
 */
export const addFamilyLineAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    invitation_id: id,
    subject: String(formData.get('family_subject') || ''),
    relationship_label: String(formData.get('family_relationship_label') || ''),
  };

  await supabase.from('invitation_family_line').insert(payload);
  revalidateAdmin();
};

/**
 * 가족 라인 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateFamilyLineAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const lineId = String(formData.get('family_line_id') || '');

  const payload = {
    subject: String(formData.get('family_subject') || ''),
    relationship_label: String(formData.get('family_relationship_label') || ''),
  };

  await supabase.from('invitation_family_line').update(payload).eq('id', lineId);
  revalidateAdmin();
};

/**
 * 가족 라인 삭제
 * @param formData FormData
 * @returns Promise<void>
 */
export const deleteFamilyLineAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const lineId = String(formData.get('family_line_id') || '');
  await supabase.from('invitation_family_member').delete().eq('family_line_id', lineId);
  await supabase.from('invitation_family_line').delete().eq('id', lineId);
  revalidateAdmin();
};

/**
 * 가족 구성원 추가
 * @param formData FormData
 * @returns Promise<void>
 */
export const addFamilyMemberAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();

  const payload = {
    family_line_id: String(formData.get('family_line_id') || ''),
    role: String(formData.get('family_member_role') || ''),
    name: String(formData.get('family_member_name') || ''),
    prefix: String(formData.get('family_member_prefix') || ''),
    suffix: String(formData.get('family_member_suffix') || ''),
  };

  await supabase.from('invitation_family_member').insert(payload);
  revalidateAdmin();
};

/**
 * 가족 구성원 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateFamilyMemberAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const memberId = String(formData.get('family_member_id') || '');

  const payload = {
    family_line_id: String(formData.get('family_line_id') || ''),
    role: String(formData.get('family_member_role') || ''),
    name: String(formData.get('family_member_name') || ''),
    prefix: String(formData.get('family_member_prefix') || ''),
    suffix: String(formData.get('family_member_suffix') || ''),
  };

  await supabase.from('invitation_family_member').update(payload).eq('id', memberId);
  revalidateAdmin();
};

/**
 * 가족 구성원 삭제
 * @param formData FormData
 * @returns Promise<void>
 */
export const deleteFamilyMemberAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const memberId = String(formData.get('family_member_id') || '');
  await supabase.from('invitation_family_member').delete().eq('id', memberId);
  revalidateAdmin();
};

/**
 * 클로징 문구 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateClosingAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    message: String(formData.get('closing_message') || ''),
    signature: String(formData.get('closing_signature') || ''),
    copyright: String(formData.get('closing_copyright') || ''),
  };

  await supabase.from('invitation_closing').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};

/**
 * 갤러리 이미지 추가
 * @param formData FormData
 * @returns Promise<void>
 */
export const addGalleryImageAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();

  const galleryId = String(formData.get('gallery_id') || '');
  const payload = {
    gallery_id: galleryId,
    src: String(formData.get('image_src') || ''),
    alt: String(formData.get('image_alt') || ''),
    thumbnail: String(formData.get('image_thumbnail') || ''),
    width: Number(formData.get('image_width') || 0) || null,
    height: Number(formData.get('image_height') || 0) || null,
    sort_order: Number(formData.get('sort_order') || 0) || 0,
  };

  await supabase.from('invitation_gallery_image').insert(payload);
  revalidateAdmin();
};

/**
 * 갤러리 이미지 삭제
 * @param formData FormData
 * @returns Promise<void>
 */
export const deleteGalleryImageAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const imageId = String(formData.get('image_id') || '');
  await supabase.from('invitation_gallery_image').delete().eq('id', imageId);
  revalidateAdmin();
};
