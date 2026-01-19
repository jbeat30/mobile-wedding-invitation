'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import {
  addGalleryImageAction,
  deleteGalleryImageAction,
  updateGalleryAction,
} from '@/app/(admin)/admin/actions/assets';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextArea, TextInput } from '@/components/ui/TextInput';
import { AdminImageFileField } from '@/app/(admin)/admin/components/AdminImageFileField';

type GalleryImage = AdminDashboardData['galleryImages'][number];

type AdminSectionGalleryProps = {
  gallery: AdminDashboardData['gallery'];
  galleryItems: GalleryImage[];
  setGalleryItems: Dispatch<SetStateAction<GalleryImage[]>>;
  draggedImageId: string | null;
  setDraggedImageId: Dispatch<SetStateAction<string | null>>;
  dragOverImageId: string | null;
  setDragOverImageId: Dispatch<SetStateAction<string | null>>;
  orderSaved: boolean;
  setOrderSaved: Dispatch<SetStateAction<boolean>>;
};

/**
 * 갤러리 섹션
 * @param props AdminSectionGalleryProps
 * @returns JSX.Element
 */
export const AdminSectionGallery = ({
  gallery,
  galleryItems,
  setGalleryItems,
  draggedImageId,
  setDraggedImageId,
  dragOverImageId,
  setDragOverImageId,
  orderSaved,
  setOrderSaved,
}: AdminSectionGalleryProps) => {
  const [orderSaving, setOrderSaving] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  /**
   * 이미지 라벨 정리
   * @param src string
   * @returns string
   */
  const getImageLabel = (src: string) => {
    if (src.startsWith('data:')) {
      return '업로드 이미지';
    }
    if (src.length > 60) {
      return `${src.slice(0, 60)}...`;
    }
    return src;
  };

  return (
    <SurfaceCard className="p-6">
      <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">갤러리 이미지</h2>
      <div className="mt-4 flex flex-col gap-6">
        <div className="rounded-[12px] border border-[var(--border-light)] bg-white/70 p-4">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">갤러리 설정</h3>
          <form action={updateGalleryAction} className="mt-4 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="gallery_id" value={gallery.id} />
            <div className="flex flex-col gap-2 md:col-span-2">
              <FieldLabel htmlFor="gallery_title">갤러리 타이틀</FieldLabel>
              <TextInput id="gallery_title" name="gallery_title" defaultValue={gallery.title} />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <FieldLabel htmlFor="gallery_description">설명</FieldLabel>
              <TextArea
                id="gallery_description"
                name="gallery_description"
                defaultValue={gallery.description || ''}
              />
            </div>
            <label className="flex items-center gap-2 text-[14px] md:col-span-2">
              <input type="checkbox" name="gallery_autoplay" defaultChecked={Boolean(gallery.autoplay)} />
              자동 재생
            </label>
            <div className="flex flex-col gap-2 md:col-span-2">
              <FieldLabel htmlFor="gallery_autoplay_delay">자동 재생 간격 (ms)</FieldLabel>
              <TextInput
                id="gallery_autoplay_delay"
                name="gallery_autoplay_delay"
                type="number"
                defaultValue={gallery.autoplay_delay ?? ''}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" size="sm">
                갤러리 저장
              </Button>
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[12px] border border-[var(--border-light)] bg-white/70 p-4">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">이미지 추가</h3>
            <form action={addGalleryImageAction} className="mt-4 grid gap-4 md:grid-cols-2">
              <input type="hidden" name="gallery_id" value={gallery.id} />
              <AdminImageFileField
                id="image_src"
                name="image_src"
                label="이미지 파일"
                sectionId={gallery.id}
                hint="2MB 이하 이미지 파일"
                required
              />
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" size="sm">
                  이미지 추가
                </Button>
              </div>
            </form>
          </div>

          <div className="rounded-[12px] border border-[var(--border-light)] bg-white/70 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">이미지 목록</h3>
              <span className="text-[12px] text-[var(--text-muted)]">총 {galleryItems.length}개</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--text-muted)]">
              <span>드래그로 순서를 변경하세요</span>
              <div className="flex items-center gap-2">
                {orderSaved ? <span className="text-[var(--accent-rose-dark)]">저장됨</span> : null}
                <Button
                  type="button"
                  size="sm"
                  disabled={orderSaving}
                  onClick={() => {
                    setOrderSaving(true);
                    setOrderError(null);
                    fetch('/api/admin/gallery-order', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        galleryId: gallery.id,
                        orderedIds: galleryItems.map((image) => image.id),
                      }),
                    })
                      .then((response) => {
                        if (!response.ok) {
                          throw new Error('save failed');
                        }
                        setOrderSaved(true);
                        window.setTimeout(() => setOrderSaved(false), 1500);
                      })
                      .catch(() => {
                        setOrderError('순서 저장에 실패했습니다. 다시 시도해 주세요.');
                      })
                      .finally(() => {
                        setOrderSaving(false);
                      });
                  }}
                >
                  {orderSaving ? '저장 중...' : '순서 저장'}
                </Button>
              </div>
            </div>
            {orderError ? (
              <p className="mt-2 text-[12px] text-[var(--accent-burgundy)]">{orderError}</p>
            ) : null}
            <div className="mt-3 divide-y divide-[var(--border-light)]">
              {galleryItems.length ? (
                galleryItems.map((image) => (
                  <div
                    key={image.id}
                    draggable
                    onDragStart={() => {
                      setDraggedImageId(image.id);
                    }}
                    onDragEnter={() => {
                      setDragOverImageId(image.id);
                    }}
                    onDragEnd={() => {
                      setDraggedImageId(null);
                      setDragOverImageId(null);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                    }}
                    onDrop={() => {
                      if (!draggedImageId || draggedImageId === image.id) {
                        setDraggedImageId(null);
                        setDragOverImageId(null);
                        return;
                      }
                      setGalleryItems((prev) => {
                        const draggedIndex = prev.findIndex((item) => item.id === draggedImageId);
                        const overIndex = prev.findIndex((item) => item.id === image.id);
                        if (draggedIndex === -1 || overIndex === -1) return prev;
                        const next = [...prev];
                        const [draggedItem] = next.splice(draggedIndex, 1);
                        next.splice(overIndex, 0, draggedItem);
                        return next;
                      });
                      setDraggedImageId(null);
                      setDragOverImageId(null);
                    }}
                    className={`flex items-center justify-between gap-4 py-3 ${
                      dragOverImageId === image.id ? 'bg-[var(--bg-secondary)]/60' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 cursor-grab active:cursor-grabbing">
                      <div className="flex h-[48px] w-[28px] items-center justify-center rounded-[8px] border border-[var(--border-light)] bg-white/60 text-[14px] text-[var(--text-muted)]">
                        <span className="leading-none">⋮</span>
                      </div>
                      <Image
                        src={image.thumbnail || image.src}
                        alt={image.alt || '갤러리 이미지'}
                        width={64}
                        height={64}
                        className="h-[64px] w-[64px] rounded-[10px] object-cover"
                        unoptimized
                      />
                      <div>
                        <p className="text-[13px] font-medium text-[var(--text-primary)]">
                          {image.alt || '이미지'}
                        </p>
                        <p className="text-[12px] text-[var(--text-muted)]">{getImageLabel(image.src)}</p>
                      </div>
                    </div>
                    <form action={deleteGalleryImageAction} className="flex justify-end">
                      <input type="hidden" name="image_id" value={image.id} />
                      <Button type="submit" variant="danger" size="sm">
                        삭제
                      </Button>
                    </form>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-[12px] text-[var(--text-muted)]">
                  등록된 이미지가 없습니다
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
};
