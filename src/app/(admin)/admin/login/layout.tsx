import { ReactNode } from 'react';

/**
 * 로그인 레이아웃
 * @param props { children: ReactNode }
 * @returns JSX.Element
 */
export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {children}
    </div>
  );
}
