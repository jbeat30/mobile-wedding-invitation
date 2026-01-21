'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Label } from '@/components/ui/label';
import { compressImageInBrowser } from '@/lib/clientImageCompression';

type UploadResult = {
  url: string;
  uuid: string;
  originalName: string;
};

type UploadStatus = 'uploading' | 'success' | 'error';

type UploadItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: UploadStatus;
  errorMessage?: string;
  result?: UploadResult;
};

type UploadState = {
  isUploading: boolean;
  successCount: number;
  failedItems: UploadItem[];
};

type AdminGalleryUploadFieldProps = {
  id: string;
  name: string;
  label: string;
  sectionId: string;
  hint?: string;
  required?: boolean;
  onUploadStateChange?: (state: UploadState) => void;
};

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

/**
 * 갤러리 다중 이미지 업로드 필드
 * @param props AdminGalleryUploadFieldProps
 * @returns JSX.Element
 */
export const AdminGalleryUploadField = ({
  id,
  name,
  label,
  sectionId,
  hint,
  required = false,
  onUploadStateChange,
}: AdminGalleryUploadFieldProps) => {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const previewUrlsRef = useRef<Set<string>>(new Set());
  const stateTriggerRef = useRef<HTMLInputElement | null>(null);

  const successItems = useMemo(() => items.filter((item) => item.status === 'success'), [items]);
  const failedItems = useMemo(() => items.filter((item) => item.status === 'error'), [items]);
  const uploadingCount = useMemo(
    () => items.filter((item) => item.status === 'uploading').length,
    [items]
  );

  useEffect(() => {
    onUploadStateChange?.({
      isUploading: uploadingCount > 0,
      successCount: successItems.length,
      failedItems,
    });
  }, [failedItems, onUploadStateChange, successItems.length, uploadingCount]);

  /**
   * 폼 상태 변경 이벤트 전달
   * @returns void
   */
  const notifyFormState = useCallback(() => {
    if (!stateTriggerRef.current) return;
    stateTriggerRef.current.dispatchEvent(new Event('input', { bubbles: true }));
    stateTriggerRef.current.dispatchEvent(new Event('change', { bubbles: true }));
  }, []);

  useEffect(() => {
    notifyFormState();
  }, [items, notifyFormState]);

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.clear();
    };
  }, []);

  /**
   * 미리보기 URL 생성
   * @param file File
   * @returns string
   */
  const createPreviewUrl = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    previewUrlsRef.current.add(url);
    return url;
  }, []);

  /**
   * 업로드 항목 상태 업데이트
   * @param id string
   * @param patch Partial<UploadItem>
   */
  const updateItem = useCallback((id: string, patch: Partial<UploadItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  /**
   * 이미지 업로드 실행
   * @param item UploadItem
   * @returns Promise<void>
   */
  const uploadItem = useCallback(
    async (item: UploadItem) => {
      try {
        const compressed = await compressImageInBrowser(item.file, MAX_IMAGE_SIZE_BYTES);
        const fileToUpload = compressed.file;

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

        const result = (await response.json()) as UploadResult;
        updateItem(item.id, { status: 'success', result });
      } catch (error) {
        console.error('Gallery image upload failed:', error);
        updateItem(item.id, {
          status: 'error',
          errorMessage: '업로드에 실패했습니다. 다시 시도해 주세요.',
        });
      }
    },
    [sectionId, updateItem]
  );

  /**
   * 파일 목록 업로드 처리
   * @param files File[]
   * @returns void
   */
  const handleFiles = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;

      const nextItems: UploadItem[] = files.map((file) => {
        if (!file.type.startsWith('image/')) {
          return {
            id: crypto.randomUUID(),
            file,
            previewUrl: '',
            status: 'error',
            errorMessage: '이미지 파일만 업로드할 수 있습니다.',
          };
        }
        return {
          id: crypto.randomUUID(),
          file,
          previewUrl: createPreviewUrl(file),
          status: 'uploading',
        };
      });

      setItems((prev) => [...prev, ...nextItems]);

      const uploadingItems = nextItems.filter((item) => item.status === 'uploading');
      if (uploadingItems.length === 0) return;

      Promise.all(uploadingItems.map((item) => uploadItem(item))).catch(() => {
        // 개별 업로드 실패는 각 항목에서 처리됨
      });
    },
    [createPreviewUrl, uploadItem]
  );

  /**
   * 파일 선택 처리
   * @param event React.ChangeEvent<HTMLInputElement>
   */
  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      event.target.value = '';
      handleFiles(files);
    },
    [handleFiles]
  );

  /**
   * 드래그 오버 처리
   * @param event React.DragEvent<HTMLDivElement>
   */
  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  /**
   * 드래그 진입 처리
   * @param event React.DragEvent<HTMLDivElement>
   */
  const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  /**
   * 드래그 이탈 처리
   * @param event React.DragEvent<HTMLDivElement>
   */
  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  /**
   * 드롭 처리
   * @param event React.DragEvent<HTMLDivElement>
   */
  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const files = Array.from(event.dataTransfer.files ?? []);
      handleFiles(files);
    },
    [handleFiles]
  );

  return (
    <div className="flex flex-col gap-3">
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
          type="file"
          multiple
          accept="image/*"
          required={required && successItems.length === 0}
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
      {hint ? <p className="text-[13px] text-[var(--text-muted)]">{hint}</p> : null}
      {items.length ? (
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--text-muted)]">
          <span>업로드 진행: {uploadingCount}건</span>
          <span>성공: {successItems.length}건</span>
          <span>실패: {failedItems.length}건</span>
        </div>
      ) : null}
      {items.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-[12px] border border-[var(--border-light)] bg-white/70 p-2"
            >
              <div className="relative aspect-square overflow-hidden rounded-[10px] bg-[var(--bg-secondary)]/70">
                {item.previewUrl ? (
                  <Image
                    src={item.previewUrl}
                    alt={item.file.name}
                    fill
                    sizes="(max-width: 768px) 45vw, 20vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[12px] text-[var(--text-muted)]">
                    미리보기 없음
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-[12px] text-[var(--text-muted)]">
                <span className="line-clamp-2 text-[13px] font-medium text-[var(--text-primary)]">
                  {item.file.name}
                </span>
                {item.status === 'uploading' ? (
                  <span className="inline-flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
                    <span className="h-3 w-3 animate-spin rounded-full border border-[var(--text-secondary)] border-t-transparent" />
                    업로드 중...
                  </span>
                ) : null}
                {item.status === 'success' ? (
                  <span className="text-[13px] text-[var(--accent-rose-dark)]">업로드 완료</span>
                ) : null}
                {item.status === 'error' ? (
                  <span className="text-[13px] text-[var(--accent-burgundy)]">업로드 실패</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {failedItems.length ? (
        <div className="rounded-[10px] border border-[var(--accent-burgundy)]/30 bg-[var(--accent-burgundy)]/5 px-3 py-2 text-[13px] text-[var(--accent-burgundy)]">
          <p className="font-medium">업로드 실패 파일</p>
          <ul className="mt-1 flex flex-col gap-1">
            {failedItems.map((item) => (
              <li key={item.id}>
                {item.file.name}
                {item.errorMessage ? ` - ${item.errorMessage}` : ''}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {successItems.map((item) => (
        <input
          key={item.id}
          type="hidden"
          name={name}
          value={item.result?.url || ''}
          data-admin-track="true"
        />
      ))}
      <input
        ref={stateTriggerRef}
        type="hidden"
        name={`${name}_count`}
        value={String(successItems.length)}
        data-admin-track="true"
      />
      {successItems.map((item) => (
        <input
          key={`${item.id}-uuid`}
          type="hidden"
          name={`${name}_uuid`}
          value={item.result?.uuid || ''}
          data-admin-track="true"
        />
      ))}
      {successItems.map((item) => (
        <input
          key={`${item.id}-filename`}
          type="hidden"
          name={`${name}_filename`}
          value={item.result?.originalName || ''}
          data-admin-track="true"
        />
      ))}
    </div>
  );
};
