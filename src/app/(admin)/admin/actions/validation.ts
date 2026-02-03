import { z } from 'zod';

const toStringValue = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value : '';

const clampNumber = (value: number, min?: number, max?: number) => {
  let next = value;
  if (typeof min === 'number') next = Math.max(min, next);
  if (typeof max === 'number') next = Math.min(max, next);
  return next;
};

export const requiredString = (
  value: FormDataEntryValue | null,
  label: string,
  maxLength = 200
) => {
  const parsed = z
    .string()
    .trim()
    .min(1, `${label}을(를) 입력해주세요.`)
    .safeParse(toStringValue(value));
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    throw new Error(firstIssue?.message ?? `${label}이(가) 필요합니다.`);
  }
  const trimmed = parsed.data;
  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
};

export const optionalString = (
  value: FormDataEntryValue | null,
  fallback = '',
  maxLength = 500
) => {
  const trimmed = toStringValue(value).trim();
  if (!trimmed) return fallback;
  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
};

export const optionalNullableString = (
  value: FormDataEntryValue | null,
  maxLength = 500
) => {
  const trimmed = toStringValue(value).trim();
  if (!trimmed) return null;
  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
};

export const checkboxToBool = (value: FormDataEntryValue | null, fallback = false) => {
  if (value === null) return fallback;
  return value === 'on';
};

export const numberWithDefault = (
  value: FormDataEntryValue | null,
  fallback: number,
  options?: { min?: number; max?: number; integer?: boolean }
) => {
  const raw = toStringValue(value).trim();
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  const rounded = options?.integer ? Math.round(parsed) : parsed;
  return clampNumber(rounded, options?.min, options?.max);
};

export const requiredDateTime = (value: FormDataEntryValue | null, label: string) => {
  const raw = toStringValue(value).trim();
  const parsed = z.string().datetime({ offset: true }).safeParse(raw);
  if (!parsed.success) {
    throw new Error(`${label} 형식이 올바르지 않습니다.`);
  }
  return parsed.data;
};

export const optionalDateTime = (value: FormDataEntryValue | null) => {
  const raw = toStringValue(value).trim();
  if (!raw) return null;
  const parsed = z.string().datetime({ offset: true }).safeParse(raw);
  if (!parsed.success) return null;
  return parsed.data;
};
