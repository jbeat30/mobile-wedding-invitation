'use client';

import { useEffect, useRef, useState } from 'react';

type HeartLineDrawingProps = {
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  animate?: boolean;
  duration?: number;
};

export const HeartLineDrawing = ({
  width = 240,
  height = 80,
  strokeColor = '#C4A092',
  strokeWidth = 1.5,
  className = '',
  animate = true,
  duration = 3,
}: HeartLineDrawingProps) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate || !containerRef.current || !pathRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            setTimeout(() => {
              path.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`;
              path.style.strokeDashoffset = '0';
            }, 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [animate, duration, isVisible]);

  return (
    <div ref={containerRef} className="my-8 flex justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 60"
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
        className={className}
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
        }}
      >
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: strokeColor, stopOpacity: 0.2 }} />
            <stop offset="15%" style={{ stopColor: strokeColor, stopOpacity: 1 }} />
            <stop offset="85%" style={{ stopColor: strokeColor, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: strokeColor, stopOpacity: 0.2 }} />
          </linearGradient>
        </defs>

        <path
          ref={pathRef}
          strokeLinecap="round"
          strokeLinejoin="round"
          fillOpacity="0"
          stroke="url(#heartGradient)"
          strokeOpacity="1"
          strokeWidth={strokeWidth}
          d="M 10,30 L 30,30 M 22.096,30.975 C 27.975,30.285 33.975,30.535 39.775,31.735 C 41.825,32.165 43.845,32.705 45.855,33.295 C 50.295,34.625 54.655,36.225 59.105,37.495 C 65.505,39.315 72.325,40.445 78.805,38.955 C 78.865,38.945 78.935,38.925 78.995,38.915 C 85.545,37.365 91.665,32.645 93.285,26.125 C 93.725,24.365 93.815,22.445 93.045,20.815 C 92.275,19.175 90.465,17.945 88.685,18.275 C 87.505,18.485 86.325,19.545 85.545,20.425 C 85.115,20.915 84.745,21.445 84.445,22.015 C 84.305,22.275 83.615,23.485 83.765,23.755 C 82.205,21.045 78.605,18.825 75.425,19.845 C 72.465,20.805 71.675,24.915 72.165,27.585 C 72.525,29.535 73.435,31.335 74.425,33.045 C 75.645,35.165 77.045,37.235 78.805,38.955 C 79.085,39.235 79.385,39.515 79.695,39.775 C 80.475,40.435 81.885,42.055 83.045,41.435 C 83.185,41.365 83.295,41.235 83.415,41.125 C 85.775,38.625 88.975,37.165 92.175,36.045 C 95.615,34.845 99.255,34.285 102.875,34.035 C 110.215,33.525 117.695,34.145 124.865,32.445 C 128.445,31.595 135.025,29.835 137.905,27.545 L 155,29 L 172,30.5 L 189,29.2 L 206,30.8 L 230,30"
        />
      </svg>
    </div>
  );
};
