'use client';

import { useEffect } from 'react';

type AdminBodyFontScopeProps = {
  fontClassName: string;
  scopeClassName?: string;
};

/**
 * 어드민 전용 폰트 클래스 바인딩
 * @param props AdminBodyFontScopeProps
 * @returns null
 */
export const AdminBodyFontScope = ({
  fontClassName,
  scopeClassName = 'admin-font-scope',
}: AdminBodyFontScopeProps) => {
  useEffect(() => {
    const classNames = [fontClassName, scopeClassName].filter(Boolean);
    // 바디에 어드민 폰트 클래스 적용
    document.body.classList.add(...classNames);
    return () => {
      document.body.classList.remove(...classNames);
    };
  }, [fontClassName, scopeClassName]);

  return null;
};
