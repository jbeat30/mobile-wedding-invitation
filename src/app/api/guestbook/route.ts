import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';

type GuestbookPayload = {
  id?: string;
  name?: string;
  message?: string;
  createdAt?: string;
  passwordHash?: string;
};

const isNonEmptyText = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

const normalizeCreatedAt = (value: unknown) => {
  if (typeof value !== 'string') {
    return new Date().toISOString();
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? new Date().toISOString() : new Date(parsed).toISOString();
};

/**
 * 방명록 항목 생성
 * @param request Request
 * @returns Promise<Response>
 */
export const POST = async (request: Request) => {
  let payload: GuestbookPayload = {};

  try {
    payload = (await request.json()) as GuestbookPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  const passwordHash = typeof payload.passwordHash === 'string' ? payload.passwordHash.trim() : '';

  if (!isNonEmptyText(name) || !isNonEmptyText(message)) {
    return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
  }

  if (name.length > 20 || message.length > 200) {
    return NextResponse.json({ error: 'Input is too long' }, { status: 400 });
  }

  if (passwordHash && !/^[a-f0-9]{64}$/i.test(passwordHash)) {
    return NextResponse.json({ error: 'Invalid password hash' }, { status: 400 });
  }

  const entryId =
    typeof payload.id === 'string' && payload.id.trim()
      ? payload.id.trim()
      : typeof globalThis.crypto?.randomUUID === 'function'
        ? globalThis.crypto.randomUUID()
        : `guest-${Date.now()}`;

  const supabase = createSupabaseAdmin();

  try {
    const { id: invitationId } = await getOrCreateInvitation();

    const { data: guestbook, error: guestbookError } = await supabase
      .from('invitation_guestbook')
      .select('id')
      .eq('invitation_id', invitationId)
      .maybeSingle();

    if (guestbookError) {
      return NextResponse.json({ error: guestbookError.message }, { status: 500 });
    }

    let guestbookId = guestbook?.id;
    if (!guestbookId) {
      const { data: created, error: createError } = await supabase
        .from('invitation_guestbook')
        .insert({ invitation_id: invitationId })
        .select('id')
        .single();

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }

      guestbookId = created.id;
    }

    const { error: insertError } = await supabase.from('invitation_guestbook_entries').insert({
      id: entryId,
      guestbook_id: guestbookId,
      name,
      message,
      password_hash: passwordHash || null,
      created_at: normalizeCreatedAt(payload.createdAt),
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: entryId }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
