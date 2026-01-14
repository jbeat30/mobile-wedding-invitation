'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { invitationMock } from '@/mock/invitation.mock';
import { ImageModal } from '@/components/ui/ImageModal';

/**
 * 갤러리 섹션 - Masonry Grid (벽돌 쌓기) 레이아웃
 * 세련되고 고급스러운 비대칭 그리드와 부드러운 애니메이션
 */
export const GallerySection = () => {
  const { gallery } = invitationMock;
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  // 이미지별 랜덤 높이 생성 (한 번만 계산, 일관성 유지)
  const imageHeights = useMemo(() => {
    // 이미지 ID를 기반으로 시드 생성하여 동일 이미지는 항상 같은 높이
    const seededRandom = (seed: string) => {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return Math.abs(hash % 100) / 100;
    };

    return gallery.images.map((image) => {
      const random = seededRandom(image.id);
      // 더 미니멀하고 세련된 높이 범위: 200-320px
      if (random < 0.25) return 'h-[200px]';
      if (random < 0.5) return 'h-[240px]';
      if (random < 0.75) return 'h-[280px]';
      return 'h-[320px]';
    });
  }, [gallery.images]);

  return (
    <>
      <section id="gallery" className="bg-[var(--bg-tertiary)] py-16">
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6">
          {/* 헤더 */}
          <div className="text-center" data-animate="fade-up">
            <span className="text-[10px] tracking-[0.4em] text-[var(--muted)]">GALLERY</span>
            <h2 className="mt-3 text-[26px] font-semibold text-[var(--text-primary)]">
              {gallery.title}
            </h2>
            {gallery.description && (
              <p className="mt-2 text-[13px] text-[var(--text-secondary)]">
                {gallery.description}
              </p>
            )}
          </div>

          {/* Masonry Grid - 세련되고 미니멀한 레이아웃 */}
          <div className="columns-2 gap-2.5" data-animate="stagger">
            {gallery.images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setModalImage({ src: image.src, alt: image.alt })}
                className={`group relative mb-2.5 w-full overflow-hidden rounded-[14px] border border-white/40 bg-white/95 shadow-[0_4px_16px_rgba(41,32,26,0.08)] backdrop-blur-sm transition-all duration-[400ms] hover:shadow-[0_8px_24px_rgba(41,32,26,0.14)] hover:scale-[1.015] active:scale-[0.99] break-inside-avoid ${imageHeights[index]}`}
                data-animate-item
                aria-label={`${image.alt} 크게 보기`}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 520px) 50vw, 260px"
                    className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
                    unoptimized
                    draggable={false}
                  />
                  {/* 세련된 그라데이션 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100" />

                  {/* 미니멀한 확대 아이콘 */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100">
                    <div className="rounded-full bg-white/95 p-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] backdrop-blur-sm">
                      <svg
                        className="h-4 w-4 text-[var(--text-primary)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 하단 안내 */}
          <p className="text-center text-[12px] text-[var(--muted)]" data-animate="fade">
            사진을 터치하면 크게 볼 수 있습니다
          </p>
        </div>
      </section>

      <ImageModal
        isOpen={modalImage !== null}
        onClose={() => setModalImage(null)}
        imageSrc={modalImage?.src || ''}
        imageAlt={modalImage?.alt || ''}
      />
    </>
  );
};
