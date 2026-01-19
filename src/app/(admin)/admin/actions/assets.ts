'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { requireAdminSession, revalidateAdmin, toNumber } from './shared';

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
 * 메인 이미지 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateHeroImageAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  await supabase
    .from('invitation_assets')
    .update({ hero_image: String(formData.get('hero_image') || '') })
    .eq('invitation_id', id);

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

  await supabase
    .from('invitation_assets')
    .update({
      share_og_image: ogImage,
    })
    .eq('invitation_id', id);
  await supabase
    .from('invitation_share')
    .update({ image_url: ogImage })
    .eq('invitation_id', id);

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

  await supabase
    .from('invitation_assets')
    .update({ loading_image: String(formData.get('loading_image') || '') })
    .eq('invitation_id', id);

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
    title: String(formData.get('gallery_title') || ''),
    description: String(formData.get('gallery_description') || ''),
    autoplay: formData.get('gallery_autoplay') === 'on',
    autoplay_delay: toNumber(formData.get('gallery_autoplay_delay'), 0) || null,
  };

  await supabase.from('invitation_gallery').update(payload).eq('id', galleryId);
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
    alt: '',
    thumbnail: null,
    width: null,
    height: null,
    sort_order: 0,
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
