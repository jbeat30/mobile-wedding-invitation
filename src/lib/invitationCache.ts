import { cache } from 'react';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { InvitationTheme } from '@/mock/invitation.mock';
import { invitationMock } from '@/mock/invitation.mock';

/** 청첩장 기본 정보 DB 로우 타입 */
type InvitationRow = {
  id: string;
  locale: string;
  time_zone: string;
};

/** 테마 설정 DB 로우 타입 */
type InvitationThemeRow = {
  fonts_serif: string | null;
  fonts_serif_en: string | null;
  fonts_sans: string | null;
  bg_primary: string | null;
  bg_secondary: string | null;
  bg_tertiary: string | null;
  text_primary: string | null;
  text_secondary: string | null;
  text_tertiary: string | null;
  text_muted: string | null;
  accent_rose: string | null;
  accent_rose_dark: string | null;
  accent_rose_light: string | null;
  accent_burgundy: string | null;
  accent_gold: string | null;
  wedding_highlight_text: string | null;
  wedding_highlight_bg: string | null;
  card_bg: string | null;
  card_border: string | null;
  border_light: string | null;
  divider: string | null;
  shadow_soft: string | null;
  shadow_medium: string | null;
  shadow_card: string | null;
  radius_lg: string | null;
  radius_md: string | null;
  radius_sm: string | null;
};

/** 기본 로케일 설정 */
const DEFAULT_LOCALE = 'ko-KR';

/** 기본 타임존 설정 */
const DEFAULT_TIMEZONE = 'Asia/Seoul';

/**
 * 청첩장 기본 레코드 조회 또는 생성 (캐시됨)
 * React.cache()로 같은 요청 내에서 중복 호출 방지
 * @returns 청첩장 기본 정보 (id, locale, time_zone)
 */
export const getCachedInvitation = cache(async (): Promise<InvitationRow> => {
  const supabase = createSupabaseAdmin();
  const { data: existing, error } = await supabase
    .from('invitations')
    .select('id, locale, time_zone')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (existing) {
    return existing as InvitationRow;
  }

  const slug = 'default';
  const { data: created, error: insertError } = await supabase
    .from('invitations')
    .insert({
      slug,
      locale: DEFAULT_LOCALE,
      time_zone: DEFAULT_TIMEZONE,
    })
    .select('id, locale, time_zone')
    .single();

  if (insertError) {
    throw insertError;
  }

  return created as InvitationRow;
});

/**
 * DB 테마 로우를 InvitationTheme 타입으로 매핑
 * @param row DB에서 조회한 테마 로우 (null이면 기본값 사용)
 * @returns InvitationTheme 객체
 */
const mapTheme = (row: InvitationThemeRow | null): InvitationTheme => {
  const fallback = invitationMock.theme;
  if (!row) return fallback;

  return {
    fonts: {
      serif: row.fonts_serif || fallback.fonts.serif,
      serifEn: row.fonts_serif_en || fallback.fonts.serifEn,
      sans: row.fonts_sans || fallback.fonts.sans,
    },
    colors: {
      background: {
        primary: row.bg_primary || fallback.colors.background.primary,
        secondary: row.bg_secondary || fallback.colors.background.secondary,
        tertiary: row.bg_tertiary || fallback.colors.background.tertiary,
      },
      text: {
        primary: row.text_primary || fallback.colors.text.primary,
        secondary: row.text_secondary || fallback.colors.text.secondary,
        tertiary: row.text_tertiary || fallback.colors.text.tertiary,
        muted: row.text_muted || fallback.colors.text.muted,
      },
      accent: {
        rose: row.accent_rose || fallback.colors.accent.rose,
        roseDark: row.accent_rose_dark || fallback.colors.accent.roseDark,
        roseLight: row.accent_rose_light || fallback.colors.accent.roseLight,
        burgundy: row.accent_burgundy || fallback.colors.accent.burgundy,
        gold: row.accent_gold || fallback.colors.accent.gold,
      },
      weddingHighlight: {
        text: row.wedding_highlight_text || fallback.colors.weddingHighlight.text,
        background: row.wedding_highlight_bg || fallback.colors.weddingHighlight.background,
      },
      card: {
        background: row.card_bg || fallback.colors.card.background,
        border: row.card_border || fallback.colors.card.border,
      },
      border: {
        light: row.border_light || fallback.colors.border.light,
        divider: row.divider || fallback.colors.border.divider,
      },
    },
    shadow: {
      soft: row.shadow_soft || fallback.shadow.soft,
      medium: row.shadow_medium || fallback.shadow.medium,
      card: row.shadow_card || fallback.shadow.card,
    },
    radius: {
      lg: row.radius_lg || fallback.radius.lg,
      md: row.radius_md || fallback.radius.md,
      sm: row.radius_sm || fallback.radius.sm,
    },
  };
};

/**
 * 테마 설정 로드 (캐시됨)
 * React.cache()로 layout.tsx와 invitationData.ts에서 중복 호출 방지
 * @returns 테마 설정 (조회 실패 시 기본값 반환)
 */
export const getCachedTheme = cache(async (): Promise<InvitationTheme> => {
  try {
    const supabase = createSupabaseAdmin();
    const invitation = await getCachedInvitation();
    const { data: themeRow, error } = await supabase
      .from('invitation_theme')
      .select('*')
      .eq('invitation_id', invitation.id)
      .maybeSingle();
    if (error) {
      return invitationMock.theme;
    }
    return mapTheme(themeRow as InvitationThemeRow | null);
  } catch {
    return invitationMock.theme;
  }
});
