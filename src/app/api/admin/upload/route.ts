import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdminAuth } from '@/lib/adminAuth';
import { uploadToR2 } from '@/lib/r2';

/**
 * 업로드 가능한 파일 타입 체크
 * @param file File
 * @returns boolean
 */
const isAllowedFile = (file: File) =>
  file.type.startsWith('image/') || file.type.startsWith('audio/');

/**
 * 관리자 업로드 API (R2)
 * @param req Request
 * @returns Promise<Response>
 */
export const POST = async (req: Request) => {
  const supabase = createSupabaseAdmin();
  try {
    await requireAdminAuth(supabase);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  const sectionId = String(formData.get('sectionId') || '').trim();

  if (!sectionId) {
    return NextResponse.json({ error: 'sectionId is required' }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }
  if (!isAllowedFile(file)) {
    return NextResponse.json({ error: 'unsupported file type' }, { status: 400 });
  }

  try {
    const result = await uploadToR2({ sectionId, file });
    return NextResponse.json(result);
  } catch (error) {
    console.error('R2 upload error:', error);
    return NextResponse.json({ error: 'upload failed' }, { status: 500 });
  }
};
