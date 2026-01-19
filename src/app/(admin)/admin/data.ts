import { invitationMock } from '@/mock/invitation.mock';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';

const DEFAULT_LOCALE = 'ko-KR';
const DEFAULT_TIMEZONE = 'Asia/Seoul';

/**
 * 초대장 기본 레코드 확보
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
 * 관리자 데이터 로드
 * @returns Promise<Record<string, unknown>>
 */
export const loadAdminData = async () => {
  const { content, assets } = invitationMock;
  const invitationId = 'mock-invitation';
  const eventId = 'mock-event';
  const locationId = 'mock-location';
  const galleryId = 'mock-gallery';
  const rsvpId = 'mock-rsvp';
  const accountsId = 'mock-accounts';

  return {
    invitationId,
    loading: {
      id: 'mock-loading',
      enabled: content.loading.enabled,
      message: content.loading.message,
      min_duration: content.loading.minDuration,
      additional_duration: content.loading.additionalDuration,
    },
    profile: {
      groom_first_name: content.couple.groom.firstName,
      groom_last_name: content.couple.groom.lastName,
      groom_bio: content.couple.groom.bio || '',
      groom_profile_image: content.couple.groom.profileImage || '',
      bride_first_name: content.couple.bride.firstName,
      bride_last_name: content.couple.bride.lastName,
      bride_bio: content.couple.bride.bio || '',
      bride_profile_image: content.couple.bride.profileImage || '',
    },
    parents: {
      groom: {
        father: content.couple.parents.groom.father || '',
        mother: content.couple.parents.groom.mother || '',
      },
      bride: {
        father: content.couple.parents.bride.father || '',
        mother: content.couple.parents.bride.mother || '',
      },
    },
    event: {
      id: eventId,
      date_time: content.event.dateTime,
      venue: content.event.venue,
      address: content.event.address,
    },
    assets: {
      id: 'mock-assets',
      hero_image: assets.heroImage,
      loading_image: assets.loadingImage,
      share_og_image: assets.share.ogImage,
      share_kakao_image: assets.share.kakaoImage,
    },
    greeting: {
      id: 'mock-greeting',
      poetic_note: content.greeting.poeticNote || '',
      message_lines: content.greeting.message,
    },
    share: {
      id: 'mock-share',
      title: content.share.title,
      description: content.share.description,
      image_url: content.share.imageUrl,
      kakao_title: content.share.kakaoTemplate?.title || '',
      kakao_description: content.share.kakaoTemplate?.description || '',
      kakao_image_url: content.share.kakaoTemplate?.imageUrl || '',
      kakao_button_label: content.share.kakaoTemplate?.buttonLabel || '',
    },
    bgm: {
      id: 'mock-bgm',
      enabled: content.bgm.enabled,
      audio_url: content.bgm.audioUrl || '',
      auto_play: content.bgm.autoPlay,
      loop: content.bgm.loop,
    },
    gallery: {
      id: galleryId,
      title: content.gallery.title,
      description: content.gallery.description || '',
      autoplay: Boolean(content.gallery.autoplay),
      autoplay_delay:
        content.gallery.autoplayDelay ?? (content.gallery.autoplay ? 3000 : null),
    },
    galleryImages: content.gallery.images.map((image, index) => ({
      id: image.id,
      gallery_id: galleryId,
      src: image.src,
      alt: image.alt,
      thumbnail: image.thumbnail || null,
      width: image.width || null,
      height: image.height || null,
      sort_order: index + 1,
    })),
    location: {
      id: locationId,
      place_name: content.location.placeName,
      address: content.event.address,
      latitude: content.location.coordinates.lat,
      longitude: content.location.coordinates.lng,
      notices: content.location.notices || [],
    },
    transportation: {
      id: 'mock-transportation',
      location_id: locationId,
      subway: content.location.transportation.subway || [],
      bus: content.location.transportation.bus || [],
      car: content.location.transportation.car || '',
      parking: content.location.transportation.parking || '',
    },
    guestbook: {
      id: 'mock-guestbook',
      privacy_notice: content.guestbook.privacyNotice,
      retention_text: content.guestbook.retentionText,
      display_mode: content.guestbook.displayMode,
      page_size: content.guestbook.pageSize,
      recent_notice: content.guestbook.recentNotice,
      enable_password: content.guestbook.enablePassword,
      enable_edit: content.guestbook.enableEdit,
      enable_delete: content.guestbook.enableDelete,
    },
    guestbookEntries: content.guestbook.mockEntries,
    rsvp: {
      id: rsvpId,
      enabled: content.rsvp.enabled,
      deadline: content.rsvp.deadline,
      consent_title: content.rsvp.consent.title,
      consent_description: content.rsvp.consent.description,
      consent_retention: content.rsvp.consent.retention,
      consent_notice: content.rsvp.consent.notice,
    },
    rsvpFields: content.rsvp.fields.map((field, index) => ({
      id: `mock-rsvp-field-${index + 1}`,
      rsvp_id: rsvpId,
      field_key: field.key,
      label: field.label,
      required: field.required,
      placeholder: field.placeholder || '',
      options: field.options || [],
      sort_order: index + 1,
    })),
    rsvpResponses: content.rsvpResponses,
    accounts: {
      id: accountsId,
      title: content.accounts.title,
      description: content.accounts.description,
    },
    accountEntries: [
      ...content.accounts.groom.map((account, index) => ({
        id: `mock-account-groom-${index + 1}`,
        accounts_id: accountsId,
        group_type: 'groom',
        bank_name: account.bankName,
        account_number: account.accountNumber,
        holder: account.holder,
        label: account.label || '',
      })),
      ...content.accounts.bride.map((account, index) => ({
        id: `mock-account-bride-${index + 1}`,
        accounts_id: accountsId,
        group_type: 'bride',
        bank_name: account.bankName,
        account_number: account.accountNumber,
        holder: account.holder,
        label: account.label || '',
      })),
    ],
    closing: {
      id: 'mock-closing',
      title: content.closing.title,
      message: content.closing.message,
      copyright: content.closing.copyright || '',
    },
    sectionTitles: content.sectionTitles,
  };
};

export type AdminDashboardData = Awaited<ReturnType<typeof loadAdminData>>;
