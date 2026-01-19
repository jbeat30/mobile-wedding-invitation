'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { assertNoError, requireAdminSession, revalidateAdmin } from './shared';

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

  assertNoError(
    await supabase.from('invitation_theme').update(payload).eq('invitation_id', id)
  );
  revalidateAdmin();
};
