'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { invitationMock } from '@/mock/invitation.mock';
import { ImageModal } from '@/components/ui/ImageModal';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

/**
 * 갤러리 섹션
 * 메인 이미지 슬라이더 + 썸네일 네비게이션 (좌측 정렬, 반응형 래핑)
 */
export const GallerySection = () => {
  const { gallery } = invitationMock;
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const mainSwiperRef = useRef<SwiperType | null>(null);

  return (
    <>
      <section id="gallery" className="bg-[var(--bg-primary)] py-16">
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8 px-6">
          {/* 헤더 */}
          <div className="text-center" data-animate="fade-up">
            <span className="font-label text-[11px] text-[var(--accent-rose)]">GALLERY</span>
            <h2 className="mt-2 text-[24px] font-medium text-[var(--text-primary)]">
              {gallery.title}
            </h2>
            {gallery.description && (
              <p className="mt-2 text-[14px] text-[var(--text-tertiary)]">
                {gallery.description}
              </p>
            )}
          </div>

          {/* 메인 슬라이더 */}
          <div className="relative" data-animate="scale">
            <Swiper
              modules={[Navigation, Thumbs]}
              spaceBetween={0}
              slidesPerView={1}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              navigation={{
                nextEl: '.gallery-next',
                prevEl: '.gallery-prev',
              }}
              onSwiper={(swiper) => {
                mainSwiperRef.current = swiper;
              }}
              className="rounded-[18px] overflow-hidden shadow-[0_8px_32px_rgba(41,32,26,0.12)] border border-white/50"
              style={{ touchAction: 'pan-y' }}
            >
              {gallery.images.map((image) => (
                <SwiperSlide key={image.id} className="!flex !items-center !justify-center">
                  <button
                    type="button"
                    onClick={() => setModalImage({ src: image.src, alt: image.alt })}
                    className="relative w-full h-full overflow-hidden group cursor-pointer block"
                    aria-label={`${image.alt} 크게 보기`}
                    style={{ aspectRatio: '4/3' }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 520px) 100vw, 520px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                      draggable={false}
                      style={{ width: '100%', height: '100%' }}
                    />
                    {/* 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* 확대 아이콘 */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="rounded-full bg-white/95 p-3 shadow-[0_8px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                        <svg
                          className="h-5 w-5 text-[var(--text-primary)]"
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
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* 네비게이션 버튼 */}
            <button
              type="button"
              className="gallery-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.18)] active:scale-95 disabled:opacity-0 disabled:pointer-events-none"
              aria-label="이전 이미지"
            >
              <svg
                className="h-4 w-4 text-[var(--text-primary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              className="gallery-next absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.18)] active:scale-95 disabled:opacity-0 disabled:pointer-events-none"
              aria-label="다음 이미지"
            >
              <svg
                className="h-4 w-4 text-[var(--text-primary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 썸네일 Swiper (좌측 정렬, 반응형 래핑) */}
          <div data-animate="fade">
            <Swiper
              modules={[Thumbs]}
              watchSlidesProgress
              onSwiper={setThumbsSwiper}
              slidesPerView="auto"
              spaceBetween={10}
              freeMode={true}
              className="gallery-thumb"
            >
              {gallery.images.map((image, index) => (
                <SwiperSlide key={image.id} className="!w-16 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (mainSwiperRef.current) {
                        mainSwiperRef.current.slideTo(index);
                      }
                    }}
                    className="relative h-16 w-16 overflow-hidden rounded-[10px] border-2 transition-all duration-300 swiper-slide-thumb-active:border-[var(--accent)] swiper-slide-thumb-active:scale-105 swiper-slide-thumb-active:shadow-[0_4px_12px_rgba(193,154,123,0.4)] border-white/60 hover:border-[var(--accent-soft)] hover:scale-105"
                    aria-label={`${image.alt} 보기`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                      draggable={false}
                    />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 하단 안내 */}
          <p className="text-center text-[12px] text-[var(--text-muted)]" data-animate="fade">
            사진을 클릭하거나 좌우로 슬라이드하여 감상하세요
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
