'use client';

import { useEffect, useRef } from 'react';

// 밀도는 화면 면적에 비례하며, 값이 클수록 꽃잎 수가 줄어듬
// MIN_PETAL_COUNT: 최소 꽃잎 개수
// DENSITY_AREA: (width * height) / DENSITY_AREA 계산에 사용되는 밀도 기준값
const MIN_PETAL_COUNT = 6;
const DENSITY_AREA = 20000;

export const CherryBlossomCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const context: CanvasRenderingContext2D = ctx;

    let dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;
    let animationFrame = 0;
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
        this.baseSize = Math.random() * 4 + 4;
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
        this.opacity = 0.3 + this.depth * 0.5;
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

        // gradient: 잎 중앙이 살짝 밝도록 설정
        const gradient = context.createRadialGradient(1, 2, 0, 0, 2, 12);
        gradient.addColorStop(0, `rgba(255,235,240,${this.opacity})`);
        gradient.addColorStop(1, `rgba(255,175,195,${this.opacity * 0.85})`);

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

    const init = () => {
      petals.length = 0;
      // 밀도를 낮춰 잎 사이 간격이 넓게 보임
      const count = Math.max(MIN_PETAL_COUNT, Math.floor((width * height) / DENSITY_AREA));
      for (let i = 0; i < count; i += 1) {
        petals.push(new Petal(true));
      }
    };

    const animate = () => {
      context.clearRect(0, 0, width, height);
      petals.forEach((petal) => {
        petal.update();
        petal.draw();
      });
      animationFrame = window.requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      // 인트로 섹션 크기에 맞춰 캔버스 리사이즈
      const rect = parent.getBoundingClientRect();
      width = Math.max(0, rect.width);
      height = Math.max(0, rect.height);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      init();
    };

    const handleResize = () => {
      dpr = window.devicePixelRatio || 1;
      resizeCanvas();
    };

    const observer = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    handleResize();
    animationFrame = window.requestAnimationFrame(animate);
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="cherry-blossom-canvas"
      className="pointer-events-none absolute inset-0 z-20 block opacity-80"
    />
  );
};
