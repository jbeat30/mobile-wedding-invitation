import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';

type RsvpPayload = {
  id?: string;
  name?: string;
  attendance?: string;
  companions?: string;
  meal?: string;
  notes?: string;
  submittedAt?: string;
};

const normalizeText = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const normalizeOptional = (value: unknown) => {
  const trimmed = normalizeText(value);
  return trimmed ? trimmed : null;
};

const normalizeSubmittedAt = (value: unknown) => {
  if (typeof value !== 'string') {
    return new Date().toISOString();
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? new Date().toISOString() : new Date(parsed).toISOString();
};

/**
 * RSVP 응답 저장
 * @param request Request
 * @returns Promise<Response>
 */
export const POST = async (request: Request) => {
  let payload: RsvpPayload = {};

  try {
    payload = (await request.json()) as RsvpPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const attendance = normalizeText(payload.attendance);
  const meal = normalizeText(payload.meal);
  const companions = normalizeOptional(payload.companions);
  const notes = normalizeOptional(payload.notes);
  const name = normalizeText(payload.name) || '미입력';

  if (!attendance || !meal) {
    return NextResponse.json({ error: 'Attendance and meal are required' }, { status: 400 });
  }

  if (name.length > 50 || attendance.length > 20 || meal.length > 30) {
    return NextResponse.json({ error: 'Input is too long' }, { status: 400 });
  }

  if (companions && companions.length > 20) {
    return NextResponse.json({ error: 'Companions is too long' }, { status: 400 });
  }

  if (notes && notes.length > 500) {
    return NextResponse.json({ error: 'Notes is too long' }, { status: 400 });
  }

  const entryId =
    typeof payload.id === 'string' && payload.id.trim()
      ? payload.id.trim()
      : typeof globalThis.crypto?.randomUUID === 'function'
        ? globalThis.crypto.randomUUID()
        : `rsvp-${Date.now()}`;

  const supabase = createSupabaseAdmin();

  try {
    const { id: invitationId } = await getOrCreateInvitation();

    const { data: rsvp, error: rsvpError } = await supabase
      .from('invitation_rsvp')
      .select('id')
      .eq('invitation_id', invitationId)
      .maybeSingle();

    if (rsvpError) {
      return NextResponse.json({ error: rsvpError.message }, { status: 500 });
    }

    let rsvpId = rsvp?.id;
    if (!rsvpId) {
      const { data: created, error: createError } = await supabase
        .from('invitation_rsvp')
        .insert({ invitation_id: invitationId })
        .select('id')
        .single();

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }

      rsvpId = created.id;
    }

    const { error: insertError } = await supabase.from('invitation_rsvp_responses').insert({
      id: entryId,
      rsvp_id: rsvpId,
      name,
      attendance,
      companions,
      meal,
      notes,
      submitted_at: normalizeSubmittedAt(payload.submittedAt),
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
