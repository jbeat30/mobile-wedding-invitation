'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Label } from '@/components/ui/label';
import { compressImageInBrowser } from '@/lib/clientImageCompression';

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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const hasMountedRef = useRef(false);
  const showPreview = previewUrl.trim().length > 0 && !errorMessage;

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

  /**
   * 변경 이벤트 전달
   * @returns void
   */
  const notifyChange = useCallback(() => {
    if (!hiddenInputRef.current) return;
    hiddenInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
    hiddenInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    notifyChange();
  }, [value, uploadedMeta, notifyChange]);

  /**
   * 단일 파일 업로드 처리
   * @param file File
   * @returns Promise<void>
   */
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('이미지 파일만 업로드할 수 있습니다');
        return;
      }
      setUploading(true);
      setErrorMessage('');
      setSelectedFileName(file.name);

      try {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(String(reader.result || ''));
        };
        reader.readAsDataURL(file);

        const MAX_SIZE = 2 * 1024 * 1024;
        let fileToUpload = file;

        if (file.size > MAX_SIZE) {
          const compressed = await compressImageInBrowser(file, MAX_SIZE);
          fileToUpload = compressed.file;
          console.log(
            `압축 완료: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`
          );
        }

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('sectionId', sectionId);

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
    },
    [sectionId]
  );

  /**
   * 파일 선택 처리
   * @param event ChangeEvent<HTMLInputElement>
   * @returns void
   */
  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      handleFileUpload(file);
    },
    [handleFileUpload]
  );

  /**
   * 드래그 오버 처리
   * @param event DragEvent<HTMLDivElement>
   * @returns void
   */
  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  /**
   * 드래그 진입 처리
   * @param event DragEvent<HTMLDivElement>
   * @returns void
   */
  const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  /**
   * 드래그 이탈 처리
   * @param event DragEvent<HTMLDivElement>
   * @returns void
   */
  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  /**
   * 드롭 처리
   * @param event DragEvent<HTMLDivElement>
   * @returns void
   */
  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (!file) return;
      handleFileUpload(file);
    },
    [handleFileUpload]
  );

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div
        className={`rounded-[12px] border-2 border-dashed px-4 py-5 transition-colors ${
          isDragging
            ? 'border-[var(--accent-rose-dark)] bg-[var(--bg-secondary)]/70'
            : 'border-[var(--border-light)] bg-white/60'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id={id}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          required={required}
          onChange={handleInputChange}
          className="sr-only"
        />
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-[14px] font-medium text-[var(--text-primary)]">
            이미지를 드래그하거나 아래 버튼으로 선택하세요
          </p>
          <label
            htmlFor={id}
            className="inline-flex cursor-pointer items-center rounded-[8px] bg-[var(--bg-secondary)] px-3 py-1.5 text-[14px] text-[var(--text-secondary)]"
          >
            파일 선택
          </label>
          <p className="text-[13px] text-[var(--text-muted)]">PNG, JPG, WEBP 등 이미지 파일</p>
        </div>
      </div>
      <input
        ref={hiddenInputRef}
        type="hidden"
        name={name}
        value={value}
        data-admin-track="true"
      />
      <input type="hidden" name={`${name}_uuid`} value={uploadedMeta?.uuid || ''} data-admin-track="true" />
      <input
        type="hidden"
        name={`${name}_filename`}
        value={uploadedMeta?.filename || ''}
        data-admin-track="true"
      />
      {selectedFileName ? (
        <p className="text-[14px] text-[var(--text-secondary)]">
          선택된 파일: <span className="font-medium">{selectedFileName}</span>
        </p>
      ) : null}
      {hint ? <p className="text-[14px] text-[var(--text-muted)]">{hint}</p> : null}
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
            <div className="flex h-[120px] items-center justify-center text-[14px] text-[var(--text-muted)]">
              미리보기를 불러올 수 없습니다
            </div>
          )}
        </div>
      ) : null}
      {uploading ? (
        <p className="inline-flex items-center gap-2 text-[14px] text-[var(--text-secondary)]">
          <span className="h-3 w-3 animate-spin rounded-full border border-[var(--text-secondary)] border-t-transparent" />
          업로드 중...
        </p>
      ) : null}
      {errorMessage ? (
        <p className="text-[14px] text-[var(--accent-burgundy)]">{errorMessage}</p>
      ) : null}
    </div>
  );
};
