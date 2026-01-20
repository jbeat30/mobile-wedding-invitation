'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FieldLabel } from '@/components/ui/FieldLabel';

type AdminImageFileFieldProps = {
  id: string;
  name: string;
  label: string;
  sectionId: string;
  defaultValue?: string | null;
  defaultFileName?: string | null;
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
  sectionId,
  defaultValue = '',
  defaultFileName = '',
  hint,
  previewClassName = 'h-[360px]',
  required = false,
}: AdminImageFileFieldProps) => {
  const [value, setValue] = useState<string>(defaultValue || '');
  const [previewUrl, setPreviewUrl] = useState<string>(defaultValue || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedMeta, setUploadedMeta] = useState<{ uuid: string; filename: string } | null>(
    null
  );
  const [selectedFileName, setSelectedFileName] = useState<string>(defaultFileName || '');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const showPreview = previewUrl.trim().length > 0 && !errorMessage;
  const maxSize = 2 * 1024 * 1024;

  const toggleFormSubmit = (disabled: boolean) => {
    const form = fileInputRef.current?.form;
    if (!form) return;
    const submitButtons = form.querySelectorAll<HTMLButtonElement | HTMLInputElement>(
      'button[type="submit"], input[type="submit"]'
    );
    submitButtons.forEach((button) => {
      if (disabled) {
        if (!button.disabled) {
          button.dataset.uploadDisabled = 'true';
          button.disabled = true;
        }
        return;
      }
      if (button.dataset.uploadDisabled === 'true') {
        button.disabled = false;
        delete button.dataset.uploadDisabled;
      }
    });
  };

  useEffect(() => {
    toggleFormSubmit(uploading);
    return () => {
      toggleFormSubmit(false);
    };
  }, [uploading]);

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        ref={fileInputRef}
        type="file"
        accept="image/*"
        required={required}
        onChange={async (event) => {
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
          setUploading(true);
          setErrorMessage('');
          setSelectedFileName(file.name);
          const reader = new FileReader();
          reader.onload = () => {
            setPreviewUrl(String(reader.result || ''));
          };
          reader.readAsDataURL(file);
          const formData = new FormData();
          formData.append('file', file);
          formData.append('sectionId', sectionId);
          try {
            const response = await fetch('/api/admin/upload', {
              method: 'POST',
              body: formData,
            });
            if (!response.ok) {
              throw new Error('upload failed');
            }
            const result = (await response.json()) as {
              url: string;
              uuid: string;
              originalName: string;
            };
            setValue(result.url);
            setUploadedMeta({ uuid: result.uuid, filename: result.originalName });
          } catch (error) {
            console.error('Image upload failed:', error);
            setErrorMessage('업로드에 실패했습니다. 다시 시도해 주세요.');
          } finally {
            setUploading(false);
          }
        }}
        className="w-full rounded-[10px] border border-[var(--border-light)] bg-white/70 px-3 py-2 text-[13px] text-[var(--text-primary)] file:mr-3 file:rounded-[8px] file:border-0 file:bg-[var(--bg-secondary)] file:px-3 file:py-1.5 file:text-[12px] file:text-[var(--text-secondary)]"
      />
      <input type="hidden" name={name} value={value} />
      <input type="hidden" name={`${name}_uuid`} value={uploadedMeta?.uuid || ''} />
      <input type="hidden" name={`${name}_filename`} value={uploadedMeta?.filename || ''} />
      {selectedFileName ? (
        <p className="text-[11px] text-[var(--text-secondary)]">
          선택된 파일: <span className="font-medium">{selectedFileName}</span>
        </p>
      ) : null}
      {hint ? <p className="text-[11px] text-[var(--text-muted)]">{hint}</p> : null}
      {previewUrl.trim().length > 0 ? (
        <div className="relative overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-white/60">
          {showPreview ? (
            <div className={`relative w-full ${previewClassName}`}>
              <Image
                src={previewUrl}
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
      {uploading ? (
        <p className="inline-flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
          <span className="h-3 w-3 animate-spin rounded-full border border-[var(--text-secondary)] border-t-transparent" />
          업로드 중...
        </p>
      ) : null}
      {errorMessage ? (
        <p className="text-[11px] text-[var(--accent-burgundy)]">{errorMessage}</p>
      ) : null}
    </div>
  );
};
