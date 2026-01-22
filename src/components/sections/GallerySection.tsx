'use client';

import { useState, useRef, useCallback } from 'react';
import type { SyntheticEvent } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { InvitationGallery } from '@/mock/invitation.mock';
import { ImageModal } from '@/components/ui/ImageModal';
import { SectionHeader } from '@/components/ui/SectionHeader';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

/**
 * 갤러리 섹션
 * 메인 이미지 슬라이더 + 썸네일 네비게이션 (좌측 정렬, 반응형 래핑)
 */
type GallerySectionProps = {
  gallery: InvitationGallery;
};

export const GallerySection = ({ gallery }: GallerySectionProps) => {
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const [portraitMap, setPortraitMap] = useState<Record<string, boolean>>({});
  const [activeIndex, setActiveIndex] = useState(0);

  const handleImageLoad = (id: string) => (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    const isPortrait = image.naturalHeight > image.naturalWidth;
    setPortraitMap((prev) => {
      if (prev[id] === isPortrait) return prev;
      return { ...prev, [id]: isPortrait };
    });
  };

  /**
   * 메인 슬라이더 변경 처리
   * @param swiper Swiper 인스턴스
   */
  const handleMainSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  /**
   * 모달 닫기 시 메인 슬라이더 동기화
   */
  const handleModalClose = useCallback(() => {
    setModalIndex(null);
    if (mainSwiperRef.current && mainSwiperRef.current.realIndex !== activeIndex) {
      mainSwiperRef.current.slideTo(activeIndex);
    }
  }, [activeIndex]);

  return (
    <>
      <section id="gallery" className="bg-[var(--bg-primary)] py-12">
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8 px-6">
          {/* 헤더 */}
          <div className="text-center" data-animate="fade-up" data-animate-trigger="section">
            <SectionHeader
              kicker="GALLERY"
              title={gallery.title}
              description={gallery.description}
              kickerClassName="font-label text-[14px] text-[var(--accent-rose)]"
              titleClassName="mt-2 text-[24px] font-medium text-[var(--text-primary)]"
              descriptionClassName="mt-2 text-[14px] text-[var(--text-tertiary)]"
            />
          </div>

          {/* 메인 슬라이더 */}
          <div
            className="relative"
            data-animate="scale"
            onContextMenu={(e) => e.preventDefault()}
          >
            <Swiper
              modules={[Navigation, Thumbs, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              autoplay={
                gallery.autoplay
                  ? {
                      delay: gallery.autoplayDelay ?? 3000,
                      disableOnInteraction: false,
                    }
                  : false
              }
              navigation={{
                nextEl: '.gallery-next',
                prevEl: '.gallery-prev',
              }}
              onSlideChange={handleMainSlideChange}
              onSwiper={(swiper) => {
                mainSwiperRef.current = swiper;
              }}
              className="rounded-[18px] overflow-hidden shadow-[0_8px_32px_rgba(41,32,26,0.12)] border border-white/50 [&_img]:pointer-events-none [&_img]:select-none"
              style={{ touchAction: 'pan-y' }}
            >
              {gallery.images.map((image, index) => {
                const isPortrait = portraitMap[image.id] === true;

                return (
                <SwiperSlide
                  key={image.id}
                  className="!flex !items-center !justify-center bg-transparent"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveIndex(index);
                      setModalIndex(index);
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    className="relative w-full overflow-hidden group cursor-pointer block aspect-[4/3] bg-[var(--bg-secondary)]"
                    aria-label={`${image.alt} 크게 보기`}
                  >
                    {isPortrait && (
                      <Image
                        src={image.src}
                        alt=""
                        fill
                        sizes="(max-width: 520px) 100vw, 520px"
                        className="object-cover scale-105 blur-md opacity-60 pointer-events-none select-none"
                        aria-hidden
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        onTouchStart={(e) => e.preventDefault()}
                      />
                    )}
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 520px) 100vw, 520px"
                      className={`transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none ${
                        isPortrait ? 'object-contain' : 'object-cover'
                      }`}
                      onLoad={handleImageLoad(image.id)}
                      priority={index === 0}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      onTouchStart={(e) => e.preventDefault()}
                      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
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
                );
              })}
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
          <div data-animate="fade" onContextMenu={(e) => e.preventDefault()}>
            <Swiper
              modules={[Thumbs]}
              watchSlidesProgress
              onSwiper={setThumbsSwiper}
              slidesPerView="auto"
              spaceBetween={10}
              freeMode={true}
              className="gallery-thumb [&_img]:pointer-events-none [&_img]:select-none"
            >
              {gallery.images.map((image, index) => (
                <SwiperSlide
                  key={image.id}
                  className="!w-16 pt-2 bg-transparent"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (mainSwiperRef.current) {
                        mainSwiperRef.current.slideTo(index);
                      }
                      setActiveIndex(index);
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    className="relative h-16 w-16 overflow-hidden rounded-[10px] border-2 transition-all duration-300 swiper-slide-thumb-active:border-[var(--accent)] swiper-slide-thumb-active:scale-105 swiper-slide-thumb-active:shadow-[0_4px_12px_rgba(193,154,123,0.4)] border-white/60 hover:border-[var(--accent-soft)] hover:scale-105"
                    aria-label={`${image.alt} 보기`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="64px"
                      className="object-cover pointer-events-none select-none"
                      loading="lazy"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      onTouchStart={(e) => e.preventDefault()}
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
        isOpen={modalIndex !== null}
        onClose={handleModalClose}
        images={gallery.images}
        initialIndex={modalIndex ?? 0}
        onIndexChange={setActiveIndex}
      />
    </>
  );
};
