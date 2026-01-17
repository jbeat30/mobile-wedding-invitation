import type { ReactNode } from 'react';

type SectionHeaderProps = {
  kicker: ReactNode; // 소제목
  title?: ReactNode; // 제목
  description?: ReactNode; // 설명
  kickerClassName?: string; // 소제목 클래스 이름
  titleClassName?: string; // 제목 클래스 이름
  descriptionClassName?: string; // 설명 클래스 이름
};

/**
 * 섹션 공통 헤더 구성
 * @param props SectionHeaderProps
 * @returns JSX.Element
 */
export const SectionHeader = ({
  kicker,
  title,
  description,
  kickerClassName = '',
  titleClassName = '',
  descriptionClassName = '',
}: SectionHeaderProps) => {
  return (
    <>
      <span className={kickerClassName}>{kicker}</span>
      {title ? <h2 className={titleClassName}>{title}</h2> : null}
      {description ? <p className={descriptionClassName}>{description}</p> : null}
    </>
  );
};
