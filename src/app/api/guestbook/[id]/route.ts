import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';

type RouteContext = { params: Promise<{ id: string }> };

const PASSWORD_HASH_RE = /^[a-f0-9]{64}$/i;

const isNonEmptyText = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

/**
 * 방명록 항목 수정
 */
export const PATCH = async (request: Request, context: RouteContext) => {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'Missing entry id' }, { status: 400 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const passwordHash = typeof body.passwordHash === 'string' ? body.passwordHash.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!isNonEmptyText(name) || !isNonEmptyText(message)) {
    return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
  }

  if (name.length > 20 || message.length > 200) {
    return NextResponse.json({ error: 'Input is too long' }, { status: 400 });
  }

  if (!PASSWORD_HASH_RE.test(passwordHash)) {
    return NextResponse.json({ error: 'Invalid password hash' }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();

  const { data: entry, error: fetchError } = await supabase
    .from('invitation_guestbook_entries')
    .select('id, password_hash')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!entry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  if (!entry.password_hash) {
    return NextResponse.json({ error: 'Cannot modify this entry' }, { status: 403 });
  }

  if (entry.password_hash !== passwordHash) {
    return NextResponse.json({ error: 'Password does not match' }, { status: 403 });
  }

  const { error: updateError } = await supabase
    .from('invitation_guestbook_entries')
    .update({ name, message })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  revalidatePath('/');

  return NextResponse.json({ ok: true });
};

/**
 * 방명록 항목 삭제
 */
export const DELETE = async (request: Request, context: RouteContext) => {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'Missing entry id' }, { status: 400 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const passwordHash = typeof body.passwordHash === 'string' ? body.passwordHash.trim() : '';

  if (!PASSWORD_HASH_RE.test(passwordHash)) {
    return NextResponse.json({ error: 'Invalid password hash' }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();

  const { data: entry, error: fetchError } = await supabase
    .from('invitation_guestbook_entries')
    .select('id, password_hash')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!entry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  if (!entry.password_hash) {
    return NextResponse.json({ error: 'Cannot delete this entry' }, { status: 403 });
  }

  if (entry.password_hash !== passwordHash) {
    return NextResponse.json({ error: 'Password does not match' }, { status: 403 });
  }

  const { error: deleteError } = await supabase
    .from('invitation_guestbook_entries')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  revalidatePath('/');

  return NextResponse.json({ ok: true });
};
