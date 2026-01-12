'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { invitationMock } from '@/mock/invitation.mock';
import { ImageModal } from '@/components/ui/ImageModal';

import 'swiper/css';
import 'swiper/css/pagination';

/**
 * 갤러리 섹션 - 레퍼런스형 메인 슬라이더 + 썸네일 도트
 */
export const GallerySection = () => {
  const { gallery } = invitationMock;
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  const thumbs = useMemo(
    () =>
      gallery.images.map((image) => {
        const raw = image.thumbnail ?? image.src;
        return raw.replace(/'/g, '%27');
      }),
    [gallery.images]
  );

  return (
    <>
      <section
        id="gallery"
        className="bg-[var(--bg-tertiary)] py-16"
      >
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6">
          <div className="text-center" data-animate="fade-up">
            <span className="text-[10px] tracking-[0.4em] text-[var(--muted)]">GALLERY</span>
            <h2 className="font-[var(--font-crimson),var(--font-nanum),var(--font-gowun),serif] mt-3 text-[26px] font-semibold text-[var(--text-primary)]">
              {gallery.title}
            </h2>
            {gallery.description && (
              <p className="mt-2 text-[13px] text-[var(--text-secondary)]">
                {gallery.description}
              </p>
            )}
          </div>

          <div
            className="rounded-[var(--radius-lg)] border border-white/70 bg-white/80 p-4 shadow-[var(--shadow-soft)] backdrop-blur"
            data-animate="scale"
          >
            <Swiper
              modules={[Pagination, Autoplay]}
              slidesPerView={1}
              loop
              pagination={{
                clickable: true,
                el: '.gallery-thumb-pagination',
                renderBullet: (index, className) => {
                  const thumbUrl = thumbs[index] ?? '';
                  return `<span class="gallery-thumb ${className}" style="background-image:url('${thumbUrl}')"></span>`;
                },
              }}
              autoplay={
                gallery.autoplay
                  ? {
                      delay: gallery.autoplayDelay ?? 3800,
                      disableOnInteraction: false,
                    }
                  : false
              }
              className="gallery-swiper"
            >
              {gallery.images.map((image) => (
                <SwiperSlide key={image.id}>
                  <button
                    type="button"
                    onClick={() => setModalImage({ src: image.src, alt: image.alt })}
                    className="group relative h-[340px] w-full overflow-hidden rounded-[20px] bg-[var(--bg-secondary)]"
                    aria-label={`${image.alt} 크게 보기`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="gallery-thumb-pagination mt-5" />
          </div>

          <p className="text-center text-[12px] text-[var(--muted)]" data-animate="fade">
            썸네일을 터치하면 해당 사진으로 이동합니다
          </p>
        </div>
      </section>

      <ImageModal
        isOpen={modalImage !== null}
        onClose={() => setModalImage(null)}
        imageSrc={modalImage?.src || ''}
        imageAlt={modalImage?.alt || ''}
      />

      <style jsx global>{`
        .gallery-swiper .swiper-slide {
          padding-bottom: 6px;
        }
        .gallery-thumb-pagination {
          display: flex;
          gap: 10px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }
        .gallery-thumb {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background-size: cover;
          background-position: center;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 10px 22px rgba(41, 32, 26, 0.15);
          opacity: 0.6;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .gallery-thumb.swiper-pagination-bullet-active {
          opacity: 1;
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 1);
        }
        @media (max-width: 380px) {
          .gallery-thumb {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </>
  );
};
