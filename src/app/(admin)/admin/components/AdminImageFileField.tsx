'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FieldLabel } from '@/components/ui/FieldLabel';

type AdminImageFileFieldProps = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string | null;
  hint?: string;
  previewClassName?: string;
  required?: boolean;
};

/**
 * 이미지 파일 업로드 + 로컬 미리보기
 * @param props AdminImageFileFieldProps
 * @returns JSX.Element
 */
export const AdminImageFileField = ({
  id,
  name,
  label,
  defaultValue = '',
  hint,
  previewClassName = 'h-[360px]',
  required = false,
}: AdminImageFileFieldProps) => {
  const [value, setValue] = useState<string>(defaultValue || '');
  const [errorMessage, setErrorMessage] = useState('');
  const showPreview = value.trim().length > 0 && !errorMessage;
  const maxSize = 2 * 1024 * 1024;

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type="file"
        accept="image/*"
        required={required}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          if (!file.type.startsWith('image/')) {
            setErrorMessage('이미지 파일만 업로드할 수 있습니다');
            return;
          }
          if (file.size > maxSize) {
            setErrorMessage('이미지 파일은 2MB 이하만 가능합니다');
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            const nextValue = String(reader.result || '');
            setValue(nextValue);
            setErrorMessage('');
          };
          reader.readAsDataURL(file);
        }}
        className="w-full rounded-[10px] border border-[var(--border-light)] bg-white/70 px-3 py-2 text-[13px] text-[var(--text-primary)] file:mr-3 file:rounded-[8px] file:border-0 file:bg-[var(--bg-secondary)] file:px-3 file:py-1.5 file:text-[12px] file:text-[var(--text-secondary)]"
      />
      <input type="hidden" name={name} value={value} />
      {hint ? <p className="text-[11px] text-[var(--text-muted)]">{hint}</p> : null}
      {errorMessage ? (
        <p className="text-[11px] text-[var(--accent-burgundy)]">{errorMessage}</p>
      ) : null}
      {value.trim().length > 0 ? (
        <div className="relative overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-white/60">
          {showPreview ? (
            <div className={`relative w-full ${previewClassName}`}>
              <Image
                src={value}
                alt={`${label} 미리보기`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex h-[120px] items-center justify-center text-[12px] text-[var(--text-muted)]">
              미리보기를 불러올 수 없습니다
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
