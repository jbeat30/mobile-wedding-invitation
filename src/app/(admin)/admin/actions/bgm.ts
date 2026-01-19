'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { requireAdminSession, revalidateAdmin } from './shared';

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
    audio_url: String(formData.get('bgm_audio_url') || ''),
    auto_play: formData.get('bgm_auto_play') === 'on',
    loop: formData.get('bgm_loop') === 'on',
  };

  await supabase.from('invitation_bgm').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};

const BGM_STORAGE_BUCKET = 'invitation-bgm';

const sanitizeFilename = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '_');

/**
 * BGM 파일 업로드
 * @param formData FormData
 * @returns Promise<void>
 */
export const uploadBgmAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const file = formData.get('bgm_audio_file');
  if (!(file instanceof File)) {
    return;
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const fileName = sanitizeFilename(file.name || 'bgm.mp3');
  const filePath = `bgm/${id}/${Date.now()}-${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BGM_STORAGE_BUCKET)
    .upload(filePath, buffer, {
      contentType: file.type || 'audio/mpeg',
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicData } = supabase.storage
    .from(BGM_STORAGE_BUCKET)
    .getPublicUrl(filePath);
  const publicUrl = publicData.publicUrl;

  await supabase
    .from('invitation_bgm')
    .update({ audio_url: publicUrl })
    .eq('invitation_id', id);

  revalidateAdmin();
};
