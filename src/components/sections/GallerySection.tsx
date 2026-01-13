'use client';

import { useState } from 'react';
import Image from 'next/image';
import { invitationMock } from '@/mock/invitation.mock';
import { ImageModal } from '@/components/ui/ImageModal';

/**
 * 갤러리 섹션 - Masonry Grid (벽돌 쌓기) 레이아웃
 * 고급스러운 비대칭 그리드와 우아한 애니메이션
 */
export const GallerySection = () => {
  const { gallery } = invitationMock;
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  // Masonry 레이아웃을 위한 이미지 높이 패턴 (반복)
  const heightPatterns = ['tall', 'short', 'medium', 'short', 'tall', 'medium'];

  const getHeightClass = (index: number) => {
    const pattern = heightPatterns[index % heightPatterns.length];
    switch (pattern) {
      case 'tall':
        return 'h-[280px]';
      case 'medium':
        return 'h-[220px]';
      case 'short':
        return 'h-[180px]';
      default:
        return 'h-[220px]';
    }
  };

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

          {/* Masonry Grid */}
          <div className="columns-2 gap-3" data-animate="stagger">
            {gallery.images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setModalImage({ src: image.src, alt: image.alt })}
                className={`group relative mb-3 w-full overflow-hidden rounded-[18px] border border-white/60 bg-white/90 shadow-[0_8px_24px_rgba(41,32,26,0.12)] backdrop-blur transition-all duration-500 hover:shadow-[0_12px_32px_rgba(41,32,26,0.18)] hover:scale-[1.02] break-inside-avoid ${getHeightClass(index)}`}
                data-animate-item
                aria-label={`${image.alt} 크게 보기`}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 520px) 50vw, 260px"
                    className="object-cover transition duration-700 group-hover:scale-110"
                    unoptimized
                  />
                  {/* 그라데이션 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* 확대 아이콘 힌트 */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="rounded-full bg-white/90 p-3 shadow-lg backdrop-blur">
                      <svg
                        className="h-5 w-5 text-[var(--text-primary)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
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
