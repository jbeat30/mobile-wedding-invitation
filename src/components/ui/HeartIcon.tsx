type HeartIconProps = {
  className?: string;
  fill?: string;
  width?: number;
  height?: number;
};

/**
 * 하트 아이콘
 * public/icons/shapes/heart.svg 기반
 */
export const HeartIcon = ({
  className,
  fill = 'currentColor',
  width = 12,
  height = 11,
}: HeartIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0.88721 5.6442L5.23558 9.85513C5.50241 10.1135 5.92616 10.1135 6.19299 9.85513L10.5414 5.6442C11.1084 5.09504 11.4286 4.33939 11.4286 3.54999C11.4286 1.93996 10.1234 0.634766 8.51334 0.634766H8.37789C7.58576 0.634766 6.82469 0.942878 6.25565 1.49393L5.74766 1.98587C5.72906 2.00388 5.69951 2.00388 5.68091 1.98587L5.17292 1.49393C4.60388 0.942878 3.84281 0.634766 3.05068 0.634766H2.91523C1.30519 0.634766 0 1.93996 0 3.54999C0 4.33939 0.320132 5.09504 0.88721 5.6442Z"
        fill={fill}
      />
    </svg>
  );
};
