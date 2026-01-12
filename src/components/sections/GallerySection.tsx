'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import { invitationMock } from '@/mock/invitation.mock';
import { ImageModal } from '@/components/ui/ImageModal';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Swiper 스타일 import
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/**
 * 갤러리 섹션 - Swiper 슬라이더
 */
export const GallerySection = () => {
  const { gallery } = invitationMock;
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <section
        id="gallery"
        ref={ref}
        className="bg-white py-16"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        }}
      >
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6">
          {/* 섹션 헤더 */}
          <div className="text-center">
            <span className="text-[11px] tracking-[0.35em] text-[var(--muted)]">GALLERY</span>
            <h2 className="font-gowun mt-3 text-[24px] font-semibold text-[var(--text-primary)]">
              {gallery.title}
            </h2>
            {gallery.description && (
              <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
                {gallery.description}
              </p>
            )}
          </div>

          {/* Swiper 슬라이더 */}
          <div className="relative">
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              navigation
              loop
              className="gallery-swiper rounded-[var(--radius-lg)] overflow-hidden"
            >
              {gallery.images.map((image) => (
                <SwiperSlide key={image.id}>
                  <div
                    className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-[var(--bg-secondary)]"
                    onClick={() => setModalImage({ src: image.src, alt: image.alt })}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition hover:scale-105"
                      unoptimized
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <p className="text-center text-[12px] text-[var(--muted)]">
            이미지를 클릭하면 크게 볼 수 있습니다
          </p>
        </div>
      </section>

      {/* 이미지 확대 모달 */}
      <ImageModal
        isOpen={modalImage !== null}
        onClose={() => setModalImage(null)}
        imageSrc={modalImage?.src || ''}
        imageAlt={modalImage?.alt || ''}
      />

      <style jsx global>{`
        .gallery-swiper .swiper-pagination-bullet {
          background: var(--accent);
          opacity: 0.5;
        }
        .gallery-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
        .gallery-swiper .swiper-button-prev,
        .gallery-swiper .swiper-button-next {
          color: var(--accent);
          background: rgba(255, 255, 255, 0.9);
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .gallery-swiper .swiper-button-prev:after,
        .gallery-swiper .swiper-button-next:after {
          font-size: 16px;
        }
      `}</style>
    </>
  );
};
