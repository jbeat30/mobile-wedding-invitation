'use client';

import { useEffect, useRef } from 'react';

// 밀도는 화면 면적에 비례하며, 값이 클수록 꽃잎 수가 줄어듬
// MIN_PETAL_COUNT: 최소 꽃잎 개수
// DENSITY_AREA: (width * height) / DENSITY_AREA 계산에 사용되는 밀도 기준값
const DEFAULT_MIN_PETAL_COUNT = 160;
const DEFAULT_DENSITY_AREA = 10000;

type CherryBlossomCanvasProps = {
  density?: number; // DENSITY_AREA 값 (기본: 28000, 클수록 희소)
  opacity?: number; // 전체 투명도 (기본: 0.8)
  zIndex?: number; // z-index 값 (기본: 20)
  minPetalCount?: number; // 최소 꽃잎 개수 (기본: 22)
  spawnOffset?: number; // 신규 꽃잎 생성 시작 위치 (기본: 0)
};

export const CherryBlossomCanvas = ({
  density = DEFAULT_DENSITY_AREA,
  opacity = 0.8,
  zIndex = 20,
  minPetalCount = DEFAULT_MIN_PETAL_COUNT,
  spawnOffset = 0,
}: CherryBlossomCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spawnOffsetRef = useRef(0);

  useEffect(() => {
    spawnOffsetRef.current = Math.max(0, spawnOffset);
  }, [spawnOffset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const context: CanvasRenderingContext2D = ctx;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; // 접근성 설정
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches; // 터치스크린 감지
    const userAgent = navigator.userAgent || ''; // 사용자 에이전트 문자열
    const isKakaoWebView = /KAKAOTALK/i.test(userAgent); // 카카오톡 웹뷰 감지
    const { deviceMemory } = navigator as Navigator & { deviceMemory?: number }; // 장치 메모리 정보
    const { connection } = navigator as Navigator & { connection?: { saveData?: boolean } }; // 네트워크 정보
    // 카톡 웹뷰/저사양/모바일이면 부하 낮추는 기준임
    const isLowPower =
      Boolean(connection?.saveData) || (deviceMemory ?? 8) <= 4 || isCoarsePointer || isKakaoWebView; // 저사양 장치 감지
    // 웹뷰에서 과한 DPR/프레임 쓰면 스크롤 끊김 생겨서 제한하는 값
    const maxDpr = isKakaoWebView ? 1.25 : isLowPower ? 1.5 : 2;
    const frameInterval = isKakaoWebView ? 1000 / 24 : isLowPower ? 1000 / 30 : 1000 / 60;

    let dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    let width = 0;
    let height = 0;
    let lastWidth = 0;
    let lastHeight = 0;
    let lastDpr = dpr;
    let animationFrame = 0;
    let lastFrameTime = 0;
    let isAnimating = false;
    let isVisible = true;
    const petals: Petal[] = [];

    // 단일 벚꽃 잎 파티클
    class Petal {
      depth = 0;
      baseSize = 0;
      size = 0;
      x = 0;
      y = 0;
      speedY = 0;
      speedX = 0;
      rotation = 0;
      rotationSpeed = 0;
      swing = 0;
      swingStep = 0;
      opacity = 0;

      constructor(initial = false) {
        this.reset(initial);
      }

      // 크기/위치/속도를 랜덤화. initial=true면 화면 안쪽에서 시작
      reset(initial = false) {
        if (width <= 0 || height <= 0) return;

        this.depth = Math.random();
        // baseSize: 기본 크기 범위(작을수록 잎이 작아짐)
        // depth: 0(멀리) ~ 1(가까이)로 크기/속도 가중치
        this.baseSize = Math.random() * 3 + 3;
        this.size = this.baseSize * (0.5 + this.depth);
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height * 0.7 : -30;
        // speedY/speedX: 낙하/좌우 이동 속도 범위
        this.speedY = (Math.random() * 0.6 + 0.3) * (0.5 + this.depth);
        this.speedX = (Math.random() * 0.5 - 0.25) * (0.5 + this.depth);
        this.rotation = Math.random() * Math.PI * 2;
        // rotationSpeed: 회전 속도 범위
        this.rotationSpeed = (Math.random() * 0.018 - 0.009) * (0.5 + this.depth);
        // swing: 좌우 흔들림 폭
        this.swing = Math.random() * 1.5 + 0.5;
        this.swingStep = Math.random() * Math.PI * 2;
        // opacity: 가까운 잎일수록 더 선명
        this.opacity = 0.65 + this.depth * 0.35;
      }

      draw() {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.scale(this.size / 10, this.size / 10);

        context.beginPath();
        context.moveTo(0, -6);
        context.bezierCurveTo(3, -8, 9, -4, 7, 2);
        context.bezierCurveTo(6, 8, 1, 11, 0, 12);
        context.bezierCurveTo(-1, 11, -6, 8, -7, 2);
        context.bezierCurveTo(-9, -4, -3, -8, 0, -6);

        // gradient: 잎 중앙이 살짝 밝도록 설정 (더 선명한 핑크)
        const gradient = context.createRadialGradient(1, 2, 0, 0, 2, 12);
        gradient.addColorStop(0, `rgba(255,220,230,${this.opacity})`);
        gradient.addColorStop(1, `rgba(255,150,180,${this.opacity * 0.9})`);

        context.fillStyle = gradient;
        context.fill();
        context.restore();
      }

      // 아래로 떨어지며 좌우로 흔들리고, 화면 아래를 벗어나면 위로 재배치
      update() {
        this.y += this.speedY;
        // 0.4: 흔들림 강도 (크면 좌우 흔들림 증가)
        this.x += this.speedX + Math.sin(this.swingStep) * 0.4;
        this.rotation += this.rotationSpeed;
        this.swingStep += 0.03;

        if (this.y > height + 40) {
          this.reset();
        }

        if (this.x > width + 40) this.x = -40;
        if (this.x < -40) this.x = width + 40;
      }
    }

    const getTargetCount = () => {
      // 밀도를 낮춰 잎 사이 간격이 넓게 보임
      // 카톡 웹뷰/저사양이면 개체 수 줄여서 렌더링 부하 낮추는 용도임
      const densityScale = isKakaoWebView ? 2.1 : isLowPower ? 1.7 : 1;
      const adjustedMinCount = isLowPower
        ? Math.max(6, Math.floor(minPetalCount * 0.5))
        : minPetalCount;
      const areaCount = Math.floor((width * height) / (density * densityScale));
      const baseAreaCount = Math.floor(
        (width * Math.max(window.innerHeight, 1)) / (density * densityScale) * 0.75
      );
      const extraCount = Math.max(0, areaCount - baseAreaCount);
      const softenedCount = baseAreaCount + Math.floor(extraCount * 0.45);
      const count = Math.max(adjustedMinCount, softenedCount);
      const baseMaxCount = isKakaoWebView ? 60 : isLowPower ? 80 : 160;
      const heightScale = Math.min(2, Math.max(1, height / Math.max(window.innerHeight, 1)));
      const softenedScale = 1 + (heightScale - 1) * 0.5;
      const maxCount = Math.round(baseMaxCount * softenedScale);
      return Math.min(count, maxCount);
    };

    const getSpawnRange = (initialSpawn: boolean) => {
      const offset = spawnOffsetRef.current;
      if (initialSpawn) {
        const maxY = Math.min(height * 0.7, offset > 0 ? offset : height * 0.7);
        return { minY: 0, maxY };
      }
      const minY = Math.max(lastHeight, offset);
      return { minY, maxY: height };
    };

    const syncPetalCount = () => {
      const targetCount = getTargetCount();
      if (petals.length === targetCount) return;
      if (petals.length > targetCount) {
        petals.length = targetCount;
        return;
      }
      const nextCount = targetCount - petals.length;
      const initialSpawn = petals.length === 0;
      const range = getSpawnRange(initialSpawn);
      for (let i = 0; i < nextCount; i += 1) {
        const petal = new Petal(true);
        if (range.maxY > range.minY) {
          petal.y = Math.random() * (range.maxY - range.minY) + range.minY;
        }
        petals.push(petal);
      }
    };

    const renderStatic = () => {
      context.clearRect(0, 0, width, height);
      petals.forEach((petal) => {
        petal.draw();
      });
    };

    const animate = (time: number) => {
      if (!isAnimating) return;
      if (time - lastFrameTime < frameInterval) {
        animationFrame = window.requestAnimationFrame(animate);
        return;
      }

      lastFrameTime = time;
      context.clearRect(0, 0, width, height);
      petals.forEach((petal) => {
        petal.update();
        petal.draw();
      });
      animationFrame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (prefersReducedMotion || isAnimating) return;
      isAnimating = true;
      lastFrameTime = 0;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      isAnimating = false;
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      // 인트로 섹션 크기에 맞춰 캔버스 리사이즈
      const rect = parent.getBoundingClientRect();
      width = Math.max(0, rect.width);
      height = Math.max(0, rect.height);

      if (width <= 0 || height <= 0) {
        return;
      }

      // 핀 동작 등으로 호출되어도 크기가 동일하면 초기화하지 않음
      if (width === lastWidth && height === lastHeight && dpr === lastDpr) {
        return;
      }

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      syncPetalCount();

      lastWidth = width;
      lastHeight = height;
      lastDpr = dpr;

      renderStatic();
    };

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      resizeCanvas();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
        return;
      }
      if (isVisible) {
        startAnimation();
      }
    };

    // 화면 밖이면 애니메이션 멈춰서 스크롤 버벅임 줄이는 용도임
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry?.isIntersecting ?? true;
        if (prefersReducedMotion) {
          if (isVisible) {
            renderStatic();
          }
          return;
        }
        if (isVisible) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.05 }
    );

    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    handleResize();
    if (prefersReducedMotion) {
      renderStatic();
    } else {
      startAnimation();
    }
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    visibilityObserver.observe(canvas);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      stopAnimation();
    };
  }, [density, minPetalCount]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="cherry-blossom-canvas"
      className="pointer-events-none absolute inset-0 block"
      style={{
        zIndex,
        opacity,
      }}
    />
  );
};
