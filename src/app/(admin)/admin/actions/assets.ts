'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import {
  assertNoError,
  getActionErrorMessage,
  requireAdminSession,
  revalidateAdmin,
} from './shared';
import { deleteFromR2 } from '@/lib/r2';
import {
  isValidationError,
  numberWithDefault,
  optionalString,
  requiredString,
  safeRequiredString,
} from './validation';

/**
 * 에셋 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateAssetsAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();
  try {
    const payload = {
      hero_image: optionalString(formData.get('hero_image'), '', 500),
      loading_image: optionalString(formData.get('loading_image'), '', 500),
    };

    assertNoError(
      await supabase.from('invitation_assets').update(payload).eq('invitation_id', id)
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
 * 구 이미지 R2 + uploaded_files 정리 (이미지 교체 시 호출)
 * @param supabase SupabaseClient
 * @param oldUrl 구 이미지 URL (없으면 스킵)
 * @param newUrl 신규 이미지 URL (같으면 스킵)
 */
const cleanupOldImage = async (
  supabase: ReturnType<typeof createSupabaseAdmin>,
  oldUrl: string | null | undefined,
  newUrl: string
) => {
  if (!oldUrl || oldUrl === newUrl) return;
  const { data: fileRecord } = await supabase
    .from('uploaded_files')
    .select('file_key')
    .eq('file_url', oldUrl)
    .maybeSingle();
  if (fileRecord?.file_key) {
    await deleteFromR2(fileRecord.file_key);
    await supabase.from('uploaded_files').delete().eq('file_key', fileRecord.file_key);
  }
};

/**
 * 메인 이미지 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateHeroImageAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();
  try {
    const newUrl = optionalString(formData.get('hero_image'), '', 500);
    const { data: current } = await supabase
      .from('invitation_assets')
      .select('hero_image')
      .eq('invitation_id', id)
      .maybeSingle();
    await cleanupOldImage(supabase, current?.hero_image, newUrl);
    assertNoError(
      await supabase
        .from('invitation_assets')
        .update({ hero_image: newUrl })
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
 * 로딩 이미지 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateLoadingImageAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();
  try {
    const newUrl = optionalString(formData.get('loading_image'), '', 500);
    const { data: current } = await supabase
      .from('invitation_assets')
      .select('loading_image')
      .eq('invitation_id', id)
      .maybeSingle();
    await cleanupOldImage(supabase, current?.loading_image, newUrl);
    assertNoError(
      await supabase
        .from('invitation_assets')
        .update({ loading_image: newUrl })
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
 * 갤러리 설정 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateGalleryAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  try {
    const galleryId = requiredString(formData.get('gallery_id'), 'gallery_id', 'gallery_id', 100);

    const fieldErrors: Record<string, string> = {};
    const sectionTitle = safeRequiredString(
      formData.get('gallery_section_title'),
      'gallery_section_title',
      '갤러리 섹션 타이틀',
      100,
      fieldErrors,
      '갤러리 섹션 타이틀을 입력해주세요.'
    );

    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }

    const payload = {
      section_title: sectionTitle || '우리의 갤러리',
      description: optionalString(formData.get('gallery_description'), '', 500),
      autoplay: formData.get('gallery_autoplay') === 'on',
      autoplay_delay: numberWithDefault(formData.get('gallery_autoplay_delay'), 3000, {
        min: 0,
        max: 600000,
        integer: true,
      }),
    };

    assertNoError(
      await supabase.from('invitation_gallery').update(payload).eq('id', galleryId)
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
 * 갤러리 이미지 추가(마지막 순서로 추가)
 * @param formData FormData
 * @returns Promise<void>
 */
export const addGalleryImageAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  try {
    const galleryId = requiredString(formData.get('gallery_id'), 'gallery_id', 'gallery_id', 100);
    const imageSources = formData
      .getAll('image_src')
      .map((value) => String(value))
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    if (imageSources.length === 0) {
      return { ok: false, fieldErrors: { image_src_count: '이미지를 추가해주세요.' } };
    }

    const { data: latestSort } = await supabase
      .from('invitation_gallery_images')
      .select('sort_order')
      .eq('gallery_id', galleryId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextSortOrder = (latestSort?.sort_order ?? 0) + 1;
    const payload = imageSources.map((src, index) => ({
      gallery_id: galleryId,
      src,
      alt: '',
      thumbnail: null,
      width: null,
      height: null,
      sort_order: nextSortOrder + index,
    }));

    assertNoError(await supabase.from('invitation_gallery_images').insert(payload));
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
 * 갤러리 이미지 삭제
 * @param formData FormData
 * @returns Promise<void>
 */
export const deleteGalleryImageAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  try {
    const imageId = requiredString(formData.get('image_id'), 'image_id', 'image_id', 100);

    // 이미지 src 조회
    const { data: image } = await supabase
      .from('invitation_gallery_images')
      .select('src')
      .eq('id', imageId)
      .single();

    // R2 파일 및 uploaded_files 정리
    if (image?.src) {
      const { data: fileRecord } = await supabase
        .from('uploaded_files')
        .select('file_key')
        .eq('file_url', image.src)
        .maybeSingle();

      if (fileRecord?.file_key) {
        await deleteFromR2(fileRecord.file_key);
        await supabase.from('uploaded_files').delete().eq('file_key', fileRecord.file_key);
      }
    }

    assertNoError(await supabase.from('invitation_gallery_images').delete().eq('id', imageId));
    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    if (isValidationError(error)) {
      return { ok: false, fieldErrors: error.fieldErrors };
    }
    return { ok: false, message: getActionErrorMessage(error) };
  }
};
