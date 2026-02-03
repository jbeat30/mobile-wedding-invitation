'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import {
  assertNoError,
  getActionErrorMessage,
  parseLines,
  requireAdminSession,
  revalidateAdmin,
  revalidatePublic,
} from './shared';
import {
  isValidationError,
  numberWithDefault,
  optionalDateTime,
  optionalString,
  safeRequiredDateTime,
  safeRequiredString,
} from './validation';

/**
 * 기본 정보/부모님 정보/예식 정보 통합 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateBasicInfoAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();
  try {
    const profilePayload = {
      invitation_id: id,
      groom_first_name: optionalString(formData.get('groom_first_name'), '', 50),
      groom_last_name: optionalString(formData.get('groom_last_name'), '', 50),
      bride_first_name: optionalString(formData.get('bride_first_name'), '', 50),
      bride_last_name: optionalString(formData.get('bride_last_name'), '', 50),
    };

    const parentsPayload = {
      invitation_id: id,
      groom_father: optionalString(formData.get('groom_father_name'), '', 50),
      groom_mother: optionalString(formData.get('groom_mother_name'), '', 50),
      bride_father: optionalString(formData.get('bride_father_name'), '', 50),
      bride_mother: optionalString(formData.get('bride_mother_name'), '', 50),
    };

    assertNoError(
      await supabase.from('invitation_profile').upsert(profilePayload, {
        onConflict: 'invitation_id',
      })
    );
    assertNoError(
      await supabase.from('invitation_parents').upsert(parentsPayload, {
        onConflict: 'invitation_id',
      })
    );

    // 예식 정보도 함께 업데이트 (optional)
    const eventDateTime = optionalDateTime(formData.get('event_date_time'));
    const eventVenue = optionalString(formData.get('event_venue'), '', 200);
    const eventAddress = optionalString(formData.get('event_address'), '', 300);

    if (eventDateTime || eventVenue || eventAddress) {
      const eventPayload = {
        ...(eventDateTime && { date_time: eventDateTime }),
        ...(eventVenue && { venue: eventVenue }),
        ...(eventAddress && { address: eventAddress }),
      };

      assertNoError(
        await supabase.from('invitation_event').update(eventPayload).eq('invitation_id', id)
      );

      // 위치 정보도 업데이트
      const locationPayload = {
        ...(eventVenue && { place_name: eventVenue }),
        ...(eventAddress && { address: eventAddress }),
        ...(formData.get('location_latitude') && {
          latitude: numberWithDefault(formData.get('location_latitude'), 0),
        }),
        ...(formData.get('location_longitude') && {
          longitude: numberWithDefault(formData.get('location_longitude'), 0),
        }),
      };

      if (Object.keys(locationPayload).length > 0) {
        assertNoError(
          await supabase
            .from('invitation_location')
            .update(locationPayload)
            .eq('invitation_id', id)
        );
      }
    }

    revalidateAdmin();
    revalidatePublic();
    return { ok: true };
  } catch (error) {
    if (isValidationError(error)) {
      return { ok: false, fieldErrors: error.fieldErrors };
    }
    return { ok: false, message: getActionErrorMessage(error) };
  }
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
  try {
    const fieldErrors: Record<string, string> = {};
    const sectionTitle = safeRequiredString(
      formData.get('couple_section_title'),
      'couple_section_title',
      '커플 섹션 타이틀',
      100,
      fieldErrors,
      '커플 섹션 타이틀을 입력해주세요.'
    );

    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }

    const payload = {
      groom_bio: optionalString(formData.get('groom_bio'), '', 2000),
      groom_profile_image: optionalString(formData.get('groom_profile_image'), '', 500),
      bride_bio: optionalString(formData.get('bride_bio'), '', 2000),
      bride_profile_image: optionalString(formData.get('bride_profile_image'), '', 500),
      section_title: sectionTitle || '두 사람을 소개합니다',
    };

    assertNoError(
      await supabase.from('invitation_profile').update(payload).eq('invitation_id', id)
    );

    revalidateAdmin();
    revalidatePublic();
    return { ok: true };
  } catch (error) {
    if (isValidationError(error)) {
      return { ok: false, fieldErrors: error.fieldErrors };
    }
    return { ok: false, message: getActionErrorMessage(error) };
  }
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
  try {
    const fieldErrors: Record<string, string> = {};
    const sectionTitle = safeRequiredString(
      formData.get('loading_section_title'),
      'loading_section_title',
      '로딩 섹션 타이틀',
      100,
      fieldErrors,
      '로딩 섹션 타이틀을 입력해주세요.'
    );
    const message = safeRequiredString(
      formData.get('loading_message'),
      'loading_message',
      '로딩 문구',
      200,
      fieldErrors,
      '로딩 문구를 입력해주세요.'
    );

    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }

    const payload = {
      enabled: formData.get('loading_enabled') === 'on',
      message: message || 'We are getting married',
      min_duration: numberWithDefault(formData.get('loading_min_duration'), 1500, {
        min: 0,
        max: 600000,
        integer: true,
      }),
      additional_duration: numberWithDefault(formData.get('loading_additional_duration'), 1000, {
        min: 0,
        max: 600000,
        integer: true,
      }),
      section_title: sectionTitle || 'WEDDING INVITATION',
    };

    assertNoError(
      await supabase.from('invitation_loading').update(payload).eq('invitation_id', id)
    );
    revalidateAdmin();
    revalidatePublic();
    return { ok: true };
  } catch (error) {
    if (isValidationError(error)) {
      return { ok: false, fieldErrors: error.fieldErrors };
    }
    return { ok: false, message: getActionErrorMessage(error) };
  }
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
  try {
    const eventDateTime = optionalDateTime(formData.get('event_date_time'));
    const eventVenue = optionalString(formData.get('event_venue'), '', 200);
    const eventAddress = optionalString(formData.get('event_address'), '', 300);
    const locationLatitudeRaw = formData.get('location_latitude');
    const locationLongitudeRaw = formData.get('location_longitude');

    const locationPayload: Record<string, string | number> = {
      place_name: eventVenue,
      address: eventAddress,
    };

    if (locationLatitudeRaw !== null && locationLatitudeRaw !== '') {
      locationPayload.latitude = numberWithDefault(locationLatitudeRaw, 0);
    }

    if (locationLongitudeRaw !== null && locationLongitudeRaw !== '') {
      locationPayload.longitude = numberWithDefault(locationLongitudeRaw, 0);
    }

    const eventPayload: Record<string, string> = {
      venue: eventVenue,
      address: eventAddress,
    };

    if (eventDateTime) {
      eventPayload.date_time = eventDateTime;
    }

    assertNoError(
      await supabase.from('invitation_location').update(locationPayload).eq('invitation_id', id)
    );
    assertNoError(
      await supabase
        .from('invitation_event')
        .update(eventPayload)
        .eq('invitation_id', id)
    );
    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    if (isValidationError(error)) {
      return { ok: false, fieldErrors: error.fieldErrors };
    }
    return { ok: false, message: getActionErrorMessage(error) };
  }
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
  try {
    const fieldErrors: Record<string, string> = {};
    const sectionTitle = safeRequiredString(
      formData.get('location_section_title'),
      'location_section_title',
      '오시는 길 섹션 타이틀',
      100,
      fieldErrors,
      '오시는 길 섹션 타이틀을 입력해주세요.'
    );
    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }
    assertNoError(
      await supabase
        .from('invitation_location')
        .update({
          section_title: sectionTitle || '오시는 길',
        })
        .eq('invitation_id', id)
    );

    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    if (isValidationError(error)) {
      return { ok: false, fieldErrors: error.fieldErrors };
    }
    return { ok: false, message: getActionErrorMessage(error) };
  }
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
  try {
    const fieldErrors: Record<string, string> = {};
    const sectionTitle = optionalString(formData.get('wedding_section_title'), '결혼합니다', 100);
    const eventDateTime = safeRequiredDateTime(
      formData.get('event_date_time'),
      'event_date_time',
      '결혼식 날짜/시간',
      fieldErrors,
      '결혼식 날짜와 시간을 입력해주세요.'
    );
    const eventVenue = optionalString(formData.get('event_venue'), '', 200);
    const eventAddress = optionalString(formData.get('event_address'), '', 300);
    const notices = parseLines(optionalString(formData.get('location_notices'), '', 2000));

    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }

    assertNoError(
      await supabase
        .from('invitation_event')
        .update({
          section_title: sectionTitle,
          date_time: eventDateTime,
          venue: eventVenue,
          address: eventAddress,
        })
        .eq('invitation_id', id)
    );

    assertNoError(
      await supabase
        .from('invitation_location')
        .update({ notices })
        .eq('invitation_id', id)
    );
    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    if (isValidationError(error)) {
      return { ok: false, fieldErrors: error.fieldErrors };
    }
    return { ok: false, message: getActionErrorMessage(error) };
  }
};

/**
 * 교통 안내 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateTransportationAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  try {
    const fieldErrors: Record<string, string> = {};
    const locationId = safeRequiredString(
      formData.get('location_id'),
      'location_id',
      'location_id',
      100,
      fieldErrors
    );

    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }

    const payload = {
      subway: parseLines(optionalString(formData.get('transport_subway'), '', 2000)),
      bus: parseLines(optionalString(formData.get('transport_bus'), '', 2000)),
      car: optionalString(formData.get('transport_car'), '', 200),
      parking: optionalString(formData.get('transport_parking'), '', 200),
    };

    assertNoError(
      await supabase
        .from('invitation_transportation')
        .update(payload)
        .eq('location_id', locationId)
    );
    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    if (isValidationError(error)) {
      return { ok: false, fieldErrors: error.fieldErrors };
    }
    return { ok: false, message: getActionErrorMessage(error) };
  }
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
  try {
    const fieldErrors: Record<string, string> = {};
    const sectionTitle = safeRequiredString(
      formData.get('closing_section_title'),
      'closing_section_title',
      '마무리 섹션 타이틀',
      100,
      fieldErrors,
      '마무리 섹션 타이틀을 입력해주세요.'
    );
    const message = safeRequiredString(
      formData.get('closing_message'),
      'closing_message',
      '마무리 인사',
      2000,
      fieldErrors,
      '마무리 인사를 입력해주세요.'
    );

    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }

    const payload = {
      section_title: sectionTitle || 'THANK YOU',
      message: message || '',
      copyright: optionalString(formData.get('closing_copyright'), '', 200),
    };

    assertNoError(
      await supabase.from('invitation_closing').update(payload).eq('invitation_id', id)
    );
    revalidateAdmin();
    revalidatePublic();
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getActionErrorMessage(error) };
  }
};
