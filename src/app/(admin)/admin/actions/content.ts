'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { assertNoError, parseLines, requireAdminSession, revalidateAdmin, toNumber } from './shared';

/**
 * 기본 정보/부모님 정보 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateBasicInfoAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const profilePayload = {
    groom_first_name: String(formData.get('groom_first_name') || ''),
    groom_last_name: String(formData.get('groom_last_name') || ''),
    bride_first_name: String(formData.get('bride_first_name') || ''),
    bride_last_name: String(formData.get('bride_last_name') || ''),
  };

  const parentsPayload = {
    groom_father: String(formData.get('groom_father_name') || ''),
    groom_mother: String(formData.get('groom_mother_name') || ''),
    bride_father: String(formData.get('bride_father_name') || ''),
    bride_mother: String(formData.get('bride_mother_name') || ''),
  };

  assertNoError(
    await supabase.from('invitation_profile').update(profilePayload).eq('invitation_id', id)
  );
  assertNoError(
    await supabase.from('invitation_parents').update(parentsPayload).eq('invitation_id', id)
  );

  revalidateAdmin();
};

/**
 * 커플 섹션(소개/이미지/타이틀) 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateProfileAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    groom_bio: String(formData.get('groom_bio') || ''),
    groom_profile_image: String(formData.get('groom_profile_image') || ''),
    bride_bio: String(formData.get('bride_bio') || ''),
    bride_profile_image: String(formData.get('bride_profile_image') || ''),
  };

  assertNoError(
    await supabase.from('invitation_profile').update(payload).eq('invitation_id', id)
  );
  assertNoError(
    await supabase
      .from('invitation_section_titles')
      .update({ couple: String(formData.get('couple_section_title') || '') })
      .eq('invitation_id', id)
  );

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
  const sectionTitle = String(formData.get('loading_section_title') || '');

  assertNoError(
    await supabase.from('invitation_loading').update(payload).eq('invitation_id', id)
  );
  assertNoError(
    await supabase
      .from('invitation_section_titles')
      .update({ loading: sectionTitle })
      .eq('invitation_id', id)
  );
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

  const eventDateTime = String(formData.get('event_date_time') || '');
  const eventVenue = String(formData.get('event_venue') || '');
  const eventAddress = String(formData.get('event_address') || '');

  const payload = {
    place_name: eventVenue,
    address: eventAddress,
    latitude: toNumber(formData.get('location_latitude')),
    longitude: toNumber(formData.get('location_longitude')),
  };

  assertNoError(
    await supabase.from('invitation_location').update(payload).eq('invitation_id', id)
  );
  assertNoError(
    await supabase
      .from('invitation_event')
      .update({
        date_time: eventDateTime,
        venue: eventVenue,
        address: eventAddress,
      })
      .eq('invitation_id', id)
  );
  revalidateAdmin();
};

/**
 * 오시는 길 섹션 타이틀 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateLocationSectionTitleAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  assertNoError(
    await supabase
      .from('invitation_section_titles')
      .update({ location: String(formData.get('location_section_title') || '') })
      .eq('invitation_id', id)
  );

  revalidateAdmin();
};

/**
 * 예식 정보 섹션 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateWeddingInfoSectionAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const sectionTitle = String(formData.get('wedding_section_title') || '');
  const notices = parseLines(String(formData.get('location_notices') || ''));

  assertNoError(
    await supabase
      .from('invitation_section_titles')
      .update({ wedding: sectionTitle })
      .eq('invitation_id', id)
  );

  assertNoError(
    await supabase
      .from('invitation_location')
      .update({ notices })
      .eq('invitation_id', id)
  );
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

  assertNoError(
    await supabase.from('invitation_transportation').update(payload).eq('location_id', locationId)
  );
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
    section_title: String(formData.get('closing_title') || ''),
    message: String(formData.get('closing_message') || ''),
    copyright: String(formData.get('closing_copyright') || ''),
  };

  assertNoError(
    await supabase.from('invitation_closing').update(payload).eq('invitation_id', id)
  );
  revalidateAdmin();
};
