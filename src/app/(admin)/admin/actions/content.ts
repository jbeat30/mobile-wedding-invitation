'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { parseLines, requireAdminSession, revalidateAdmin, toNumber } from './shared';

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
    groom_first_name: String(formData.get('groom_first_name') || ''),
    groom_last_name: String(formData.get('groom_last_name') || ''),
    groom_bio: String(formData.get('groom_bio') || ''),
    groom_profile_image: String(formData.get('groom_profile_image') || ''),
    groom_role: String(formData.get('groom_role') || ''),
    bride_first_name: String(formData.get('bride_first_name') || ''),
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
