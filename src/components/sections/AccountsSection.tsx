'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { InvitationAccounts } from '@/mock/invitation.mock';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Toast } from '@/components/ui/Toast';

type AccountsSectionProps = {
  accounts: InvitationAccounts;
};

type ToastState = {
  message: string;
};

/**
 * 계좌 안내 섹션 구성 확인
 */
export const AccountsSection = ({ accounts }: AccountsSectionProps) => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const sections = useMemo(
    () => [
      { title: '신랑', entries: accounts.groom },
      { title: '신부', entries: accounts.bride },
    ],
    [accounts]
  );

  /**
   * 클립보드 복사 처리 확인
   */
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setToast({ message: '계좌번호가 복사되었습니다' });
        return;
      }

      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textarea);
      setToast({ message: result ? '계좌번호가 복사되었습니다' : '복사에 실패했습니다' });
    } catch {
      setToast({ message: '복사에 실패했습니다' });
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 2200);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [toast]);

  return (
    <section id="accounts" className="bg-[var(--bg-primary)] py-16">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8 px-6">
        <div className="text-center" data-animate="fade-up">
          <SectionHeader
            kicker="ACCOUNTS"
            title={accounts.title}
            description={accounts.description}
            kickerClassName="font-label text-[12px] text-[var(--accent-rose)]"
            titleClassName="mt-2 text-[24px] font-medium text-[var(--text-primary)]"
            descriptionClassName="mt-2 text-[14px] text-[var(--text-tertiary)]"
          />
        </div>

        <div className="flex flex-col gap-5" data-animate="stagger">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-[var(--radius-md)] border border-[var(--card-border)] bg-white/70 p-5 shadow-[var(--shadow-soft)]"
              data-animate-item
            >
              <p className="text-[14px] font-medium text-[var(--text-primary)]">{section.title}</p>
              <div className="mt-4 flex flex-col gap-3">
                {section.entries.map((entry) => (
                  <div
                    key={`${section.title}-${entry.accountNumber}`}
                    className="flex items-center justify-between gap-4 rounded-[12px] bg-[var(--bg-secondary)] px-4 py-3"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[12px] text-[var(--text-muted)]">{entry.bankName}</span>
                      <span className="text-[14px] text-[var(--text-primary)]">
                        {entry.accountNumber}
                      </span>
                      <span className="text-[12px] text-[var(--text-muted)]">{entry.holder}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(entry.accountNumber)}
                      className="rounded-full border border-[var(--accent)] px-4 py-2 text-[12px] text-[var(--accent-rose-dark)] transition hover:bg-[var(--accent-soft)]"
                    >
                      복사
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Toast isOpen={!!toast} message={toast?.message} toastClassName="py-2" />
    </section>
  );
};
