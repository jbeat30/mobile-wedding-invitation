'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { assertNoError, requireAdminSession, revalidateAdmin, toNumber } from './shared';

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

  assertNoError(
    await supabase.from('invitation_assets').update(payload).eq('invitation_id', id)
  );
  revalidateAdmin();
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

  assertNoError(
    await supabase
      .from('invitation_assets')
      .update({ hero_image: String(formData.get('hero_image') || '') })
      .eq('invitation_id', id)
  );

  revalidateAdmin();
};

/**
 * 공유 이미지 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateShareImagesAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();
  const ogImage = String(formData.get('share_og_image') || '');

  assertNoError(
    await supabase
      .from('invitation_assets')
      .update({
        share_og_image: ogImage,
      })
      .eq('invitation_id', id)
  );
  assertNoError(
    await supabase.from('invitation_share').update({ image_url: ogImage }).eq('invitation_id', id)
  );

  revalidateAdmin();
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

  assertNoError(
    await supabase
      .from('invitation_assets')
      .update({ loading_image: String(formData.get('loading_image') || '') })
      .eq('invitation_id', id)
  );

  revalidateAdmin();
};

/**
 * 갤러리 설정 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateGalleryAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const galleryId = String(formData.get('gallery_id') || '');

  const payload = {
    section_title: String(formData.get('gallery_section_title') || ''),
    description: String(formData.get('gallery_description') || ''),
    autoplay: formData.get('gallery_autoplay') === 'on',
    autoplay_delay: toNumber(formData.get('gallery_autoplay_delay'), 0) || null,
  };

  assertNoError(
    await supabase.from('invitation_gallery').update(payload).eq('id', galleryId)
  );
  revalidateAdmin();
};

/**
 * 갤러리 이미지 추가(마지막 순서로 추가)
 * @param formData FormData
 * @returns Promise<void>
 */
export const addGalleryImageAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();

  const galleryId = String(formData.get('gallery_id') || '');
  const imageSources = formData
    .getAll('image_src')
    .map((value) => String(value))
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  if (imageSources.length === 0) {
    return;
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
  assertNoError(await supabase.from('invitation_gallery_images').delete().eq('id', imageId));
  revalidateAdmin();
};
