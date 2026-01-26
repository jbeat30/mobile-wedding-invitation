import { createSupabaseAdmin } from '@/lib/supabaseAdmin';

const DEFAULT_LOCALE = 'ko-KR';
const DEFAULT_TIMEZONE = 'Asia/Seoul';

type InvitationLoadingRow = {
  id: string;
  enabled: boolean;
  message: string;
  min_duration: number;
  additional_duration: number;
  section_title: string;
};

type InvitationProfileRow = {
  id: string;
  groom_first_name: string;
  groom_last_name: string;
  groom_bio: string | null;
  groom_profile_image: string | null;
  bride_first_name: string;
  bride_last_name: string;
  bride_bio: string | null;
  bride_profile_image: string | null;
  section_title: string;
};

type InvitationParentsRow = {
  id: string;
  groom_father: string | null;
  groom_mother: string | null;
  bride_father: string | null;
  bride_mother: string | null;
};

type InvitationAssetsRow = {
  id: string;
  hero_image: string | null;
  loading_image: string | null;
  share_og_image: string | null;
  share_kakao_image: string | null;
};

type InvitationGreetingRow = {
  id: string;
  poetic_note: string | null;
  message_lines: string[];
  section_title: string;
};

type InvitationShareRow = {
  id: string;
  subtitle: string | null;
  description: string;
  image_url: string | null;
  kakao_title: string | null;
  kakao_description: string | null;
  kakao_image_url: string | null;
  kakao_button_label: string | null;
  section_title: string;
};

type InvitationBgmRow = {
  id: string;
  enabled: boolean;
  audio_url: string | null;
  auto_play: boolean;
  loop: boolean;
};

type InvitationGalleryRow = {
  id: string;
  section_title: string;
  description: string | null;
  autoplay: boolean;
  autoplay_delay: number | null;
};

type InvitationLocationRow = {
  id: string;
  place_name: string;
  address: string;
  latitude: number | string | null;
  longitude: number | string | null;
  notices: string[] | null;
  section_title: string;
};

type InvitationGuestbookRow = {
  id: string;
  privacy_notice: string;
  display_mode: string;
  page_size: number;
  recent_notice: string | null;
  enable_password: boolean;
  enable_edit: boolean;
  enable_delete: boolean;
  section_title: string;
};

type InvitationRsvpRow = {
  id: string;
  enabled: boolean;
  deadline: string | null;
  consent_title: string | null;
  consent_description: string | null;
  consent_retention: string | null;
  consent_notice: string | null;
  section_title: string;
};

type InvitationAccountsRow = {
  id: string;
  section_title: string;
  description: string | null;
};

type InvitationClosingRow = {
  id: string;
  section_title: string;
  message: string;
  copyright: string | null;
};

type InvitationEventRow = {
  id: string;
  date_time: string;
  venue: string;
  address: string;
  section_title: string;
};

type InvitationTransportationRow = {
  id: string;
  location_id: string;
  subway: string[] | null;
  bus: string[] | null;
  car: string | null;
  parking: string | null;
};

type InvitationGalleryImageRow = {
  id: string;
  gallery_id: string;
  src: string;
  alt: string | null;
  thumbnail: string | null;
  width: number | null;
  height: number | null;
  sort_order: number;
};

type InvitationAccountEntryRow = {
  id: string;
  accounts_id: string;
  group_type: 'groom' | 'bride';
  bank_name: string;
  account_number: string;
  holder: string;
  label: string | null;
  sort_order: number;
};

type InvitationGuestbookEntryRow = {
  id: string;
  guestbook_id: string;
  name: string;
  message: string;
  password_hash: string | null;
  created_at: string;
};

type InvitationRsvpResponseRow = {
  id: string;
  rsvp_id: string;
  name: string;
  attendance: string;
  companions: string | null;
  meal: string | null;
  notes: string | null;
  submitted_at: string;
};

type UploadedFileRow = {
  id: string;
  invitation_id: string;
  section_id: string;
  original_name: string;
  file_uuid: string;
  file_key: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
};

/**
 * 청첩장 기본 레코드 확보
 * @returns Promise<{ id: string }>
 */
export const getOrCreateInvitation = async () => {
  const supabase = createSupabaseAdmin();
  const { data: existing, error } = await supabase
    .from('invitations')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (existing) {
    return existing;
  }

  const slug = 'default';
  const { data: created, error: insertError } = await supabase
    .from('invitations')
    .insert({
      slug,
      locale: DEFAULT_LOCALE,
      time_zone: DEFAULT_TIMEZONE,
    })
    .select('id')
    .single();

  if (insertError) {
    throw insertError;
  }

  return created;
};

/**
 * 단일 로우 보장(없으면 생성)
 * @param supabase SupabaseClient
 * @param table string
 * @param match Record<string, string>
 * @param insertPayload Record<string, unknown>
 * @returns Promise<T>
 */
const ensureSingleRow = async (
  supabase: ReturnType<typeof createSupabaseAdmin>,
  table: string,
  match: Record<string, string>,
  insertPayload: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const { data, error } = await supabase.from(table).select('*').match(match).maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return data as Record<string, unknown>;
  }

  const { data: created, error: insertError } = await supabase
    .from(table)
    .insert(insertPayload)
    .select('*')
    .single();

  if (insertError) {
    throw insertError;
  }

  return created as Record<string, unknown>;
};

/**
 * 관리자 데이터 로드
 * @returns Promise<Record<string, unknown>>
 */
export const loadAdminData = async () => {
  const supabase = createSupabaseAdmin();
  const invitation = await getOrCreateInvitation();

  const [
    loading,
    profile,
    parents,
    assets,
    greeting,
    share,
    bgm,
    gallery,
    location,
    guestbook,
    rsvp,
    accounts,
    closing,
    event,
  ] = (await Promise.all([
    ensureSingleRow(
      supabase,
      'invitation_loading',
      { invitation_id: invitation.id },
      { invitation_id: invitation.id }
    ),
    ensureSingleRow(
      supabase,
      'invitation_profile',
      { invitation_id: invitation.id },
      { invitation_id: invitation.id }
    ),
    ensureSingleRow(
      supabase,
      'invitation_parents',
      { invitation_id: invitation.id },
      { invitation_id: invitation.id }
    ),
    ensureSingleRow(
      supabase,
      'invitation_assets',
      { invitation_id: invitation.id },
      { invitation_id: invitation.id }
    ),
    ensureSingleRow(
      supabase,
      'invitation_greeting',
      { invitation_id: invitation.id },
      { invitation_id: invitation.id }
    ),
    ensureSingleRow(
      supabase,
      'invitation_share',
      { invitation_id: invitation.id },
      { invitation_id: invitation.id }
    ),
    ensureSingleRow(
      supabase,
      'invitation_bgm',
      { invitation_id: invitation.id },
      { invitation_id: invitation.id }
    ),
    ensureSingleRow(
      supabase,
      'invitation_gallery',
      { invitation_id: invitation.id },
      { invitation_id: invitation.id }
    ),
    ensureSingleRow(
      supabase,
      'invitation_location',
      { invitation_id: invitation.id },
      { invitation_id: invitation.id }
    ),
    ensureSingleRow(
      supabase,
      'invitation_guestbook',
      { invitation_id: invitation.id },
      { invitation_id: invitation.id }
    ),
    ensureSingleRow(
      supabase,
      'invitation_rsvp',
      { invitation_id: invitation.id },
      { invitation_id: invitation.id }
    ),
    ensureSingleRow(
      supabase,
      'invitation_accounts',
      { invitation_id: invitation.id },
      { invitation_id: invitation.id }
    ),
    ensureSingleRow(
      supabase,
      'invitation_closing',
      { invitation_id: invitation.id },
      { invitation_id: invitation.id }
    ),
    ensureSingleRow(
      supabase,
      'invitation_event',
      { invitation_id: invitation.id },
      { invitation_id: invitation.id, date_time: new Date().toISOString() }
    ),
  ])) as [
    InvitationLoadingRow,
    InvitationProfileRow,
    InvitationParentsRow,
    InvitationAssetsRow,
    InvitationGreetingRow,
    InvitationShareRow,
    InvitationBgmRow,
    InvitationGalleryRow,
    InvitationLocationRow,
    InvitationGuestbookRow,
    InvitationRsvpRow,
    InvitationAccountsRow,
    InvitationClosingRow,
    InvitationEventRow,
  ];

  const sectionTitles = {
    loading: loading.section_title,
    greeting: greeting.section_title,
    couple: profile.section_title,
    wedding: event.section_title,
    location: location.section_title,
    guestbook: guestbook.section_title,
    rsvp: rsvp.section_title,
    share: share.section_title,
  };

  const transportation = (await ensureSingleRow(
    supabase,
    'invitation_transportation',
    { location_id: location.id },
    { location_id: location.id }
  )) as InvitationTransportationRow;

  const { data: galleryImagesRaw, error: galleryError } = await supabase
    .from('invitation_gallery_images')
    .select('*')
    .eq('gallery_id', gallery.id)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (galleryError) {
    throw galleryError;
  }

  const { data: accountEntriesRaw, error: accountEntriesError } = await supabase
    .from('invitation_account_entries')
    .select('*')
    .eq('accounts_id', accounts.id)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (accountEntriesError) {
    throw accountEntriesError;
  }

  const { data: guestbookEntriesRaw, error: guestbookEntriesError } = await supabase
    .from('invitation_guestbook_entries')
    .select('*')
    .eq('guestbook_id', guestbook.id)
    .order('created_at', { ascending: false });

  if (guestbookEntriesError) {
    throw guestbookEntriesError;
  }

  const { data: rsvpResponsesRaw, error: rsvpResponsesError } = await supabase
    .from('invitation_rsvp_responses')
    .select('*')
    .eq('rsvp_id', rsvp.id)
    .order('submitted_at', { ascending: false });

  if (rsvpResponsesError) {
    throw rsvpResponsesError;
  }

  const { data: uploadedFilesRaw, error: uploadedFilesError } = await supabase
    .from('uploaded_files')
    .select('*')
    .eq('invitation_id', invitation.id);

  if (uploadedFilesError) {
    throw uploadedFilesError;
  }

  const galleryImages = (galleryImagesRaw || []) as InvitationGalleryImageRow[];
  const accountEntries = (accountEntriesRaw || []) as InvitationAccountEntryRow[];
  const guestbookEntries = (guestbookEntriesRaw || []) as InvitationGuestbookEntryRow[];
  const rsvpResponses = (rsvpResponsesRaw || []) as InvitationRsvpResponseRow[];
  const uploadedFiles = (uploadedFilesRaw || []) as UploadedFileRow[];

  /**
   * 파일 URL -> 원본 파일명 매핑
   */
  const fileUrlToNameMap: Record<string, string> = {};
  uploadedFiles.forEach((file) => {
    if (file.file_url) {
      fileUrlToNameMap[file.file_url] = file.original_name;
    }
  });

  return {
    invitationId: invitation.id,
    overview: {
      galleryCount: galleryImages.length,
      guestbookCount: guestbookEntries.length,
    },
    loading: {
      id: loading.id,
      enabled: loading.enabled,
      message: loading.message,
      min_duration: loading.min_duration,
      additional_duration: loading.additional_duration,
    },
    profile: {
      groom_first_name: profile.groom_first_name,
      groom_last_name: profile.groom_last_name,
      groom_bio: profile.groom_bio || '',
      groom_profile_image: profile.groom_profile_image || '',
      bride_first_name: profile.bride_first_name,
      bride_last_name: profile.bride_last_name,
      bride_bio: profile.bride_bio || '',
      bride_profile_image: profile.bride_profile_image || '',
    },
    parents: {
      groom: {
        father: parents.groom_father || '',
        mother: parents.groom_mother || '',
      },
      bride: {
        father: parents.bride_father || '',
        mother: parents.bride_mother || '',
      },
    },
    event: {
      id: event.id,
      date_time: event.date_time,
      venue: event.venue,
      address: event.address,
    },
    assets: {
      id: assets.id,
      hero_image: assets.hero_image,
      loading_image: assets.loading_image,
      share_og_image: assets.share_og_image,
      share_kakao_image: assets.share_kakao_image,
    },
    greeting: {
      id: greeting.id,
      poetic_note: greeting.poetic_note || '',
      message_lines: greeting.message_lines || [],
    },
    share: {
      section_title: share.section_title,
      id: share.id,
      title: share.subtitle || '',
      description: share.description,
      image_url: share.image_url,
      kakao_title: share.kakao_title || '',
      kakao_description: share.kakao_description || '',
      kakao_image_url: share.kakao_image_url || '',
      kakao_button_label: share.kakao_button_label || '',
    },
    bgm: {
      id: bgm.id,
      enabled: bgm.enabled,
      audio_url: bgm.audio_url || '',
      auto_play: bgm.auto_play,
      loop: bgm.loop,
    },
    gallery: {
      id: gallery.id,
      section_title: gallery.section_title,
      description: gallery.description || '',
      autoplay: gallery.autoplay,
      autoplay_delay: gallery.autoplay_delay,
    },
    galleryImages: galleryImages.map((image) => ({
      id: image.id,
      gallery_id: image.gallery_id,
      src: image.src,
      alt: image.alt || '',
      thumbnail: image.thumbnail || null,
      width: image.width,
      height: image.height,
      sort_order: image.sort_order,
    })),
    location: {
      id: location.id,
      place_name: location.place_name,
      address: location.address,
      latitude:
        location.latitude === null || location.latitude === undefined
          ? Number.NaN
          : Number(location.latitude),
      longitude:
        location.longitude === null || location.longitude === undefined
          ? Number.NaN
          : Number(location.longitude),
      notices: location.notices || [],
    },
    transportation: {
      id: transportation.id,
      location_id: transportation.location_id,
      subway: transportation.subway || [],
      bus: transportation.bus || [],
      car: transportation.car || '',
      parking: transportation.parking || '',
    },
    guestbook: {
      id: guestbook.id,
      privacy_notice: guestbook.privacy_notice,
      display_mode: String(guestbook.display_mode || 'recent').trim(),
      page_size: guestbook.page_size,
      recent_notice: guestbook.recent_notice,
      enable_password: guestbook.enable_password,
      enable_edit: guestbook.enable_edit,
      enable_delete: guestbook.enable_delete,
      section_title: guestbook.section_title,
    },
    guestbookEntries: guestbookEntries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      message: entry.message,
      createdAt: entry.created_at,
    })),
    rsvp: {
      id: rsvp.id,
      enabled: rsvp.enabled,
      deadline: rsvp.deadline,
      consent_title: rsvp.consent_title || '',
      consent_description: rsvp.consent_description || '',
      consent_retention: rsvp.consent_retention || '',
      consent_notice: rsvp.consent_notice || '',
      section_title: rsvp.section_title,
    },
    rsvpResponses: rsvpResponses.map((entry) => ({
      id: entry.id,
      name: entry.name,
      attendance: entry.attendance,
      companions: entry.companions || '',
      meal: entry.meal || '',
      notes: entry.notes || '',
      submittedAt: entry.submitted_at,
    })),
    accounts: {
      id: accounts.id,
      section_title: accounts.section_title,
      description: accounts.description || '',
    },
    accountEntries: accountEntries.map((entry) => ({
      id: entry.id,
      accounts_id: entry.accounts_id,
      group_type: entry.group_type,
      bank_name: entry.bank_name,
      account_number: entry.account_number,
      holder: entry.holder,
      label: entry.label || '',
      sort_order: entry.sort_order,
    })),
    closing: {
      id: closing.id,
      section_title: closing.section_title,
      message: closing.message,
      copyright: closing.copyright || '',
    },
    sectionTitles: {
      loading: sectionTitles.loading,
      greeting: sectionTitles.greeting,
      couple: sectionTitles.couple,
      wedding: sectionTitles.wedding,
      location: sectionTitles.location,
      guestbook: sectionTitles.guestbook,
      rsvp: sectionTitles.rsvp,
      share: sectionTitles.share,
    },
    fileUrlToNameMap,
  };
};

export type AdminDashboardData = Awaited<ReturnType<typeof loadAdminData>>;
