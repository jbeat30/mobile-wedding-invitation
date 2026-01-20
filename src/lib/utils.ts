import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind className 합치기 유틸
 * @param inputs ClassValue[]
 * @returns string
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
