'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { invitationMock } from '@/mock/invitation.mock';

type ToastState = {
  message: string;
};

/**
 * 계좌 안내 섹션 구성 확인
 */
export const AccountsSection = () => {
  const { accounts } = invitationMock;
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
    } catch (error) {
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
    <section id="accounts" className="bg-[#f6f1ea]">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6 py-16">
        <div className="text-center">
          <span className="text-[11px] tracking-[0.35em] text-[var(--muted)]">ACCOUNTS</span>
          <h2 className="mt-3 text-[24px] font-semibold text-[#3b3b3b]">{accounts.title}</h2>
          <p className="mt-2 text-[14px] text-[#6f6a62]">{accounts.description}</p>
        </div>

        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-[var(--radius-lg)] border border-white/60 bg-white/90 p-6 shadow-[0_18px_40px_rgba(22,22,22,0.1)]"
            >
              <p className="text-[15px] font-semibold text-[#3b3b3b]">{section.title}</p>
              <div className="mt-4 flex flex-col gap-3">
                {section.entries.map((entry) => (
                  <div
                    key={`${section.title}-${entry.accountNumber}`}
                    className="flex items-center justify-between gap-4 rounded-[16px] border border-black/5 bg-[#fbfaf8] px-4 py-3"
                  >
                    <div className="flex flex-col">
                      <span className="text-[13px] text-[#8f877c]">{entry.bankName}</span>
                      <span className="text-[14px] font-medium text-[#3b3b3b]">
                        {entry.accountNumber}
                      </span>
                      <span className="text-[12px] text-[#9b9287]">{entry.holder}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(entry.accountNumber)}
                      className="rounded-full border border-[#cbb899] px-4 py-2 text-[12px] font-medium text-[#7a6a52] transition hover:bg-[#efe6d9]"
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
      {toast ? (
        <div className="fixed inset-x-0 bottom-[calc(var(--safe-bottom)+16px)] z-50 flex justify-center px-6">
          <div className="rounded-full bg-[#2f2f2f] px-5 py-2 text-[13px] text-white shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
            {toast.message}
          </div>
        </div>
      ) : null}
    </section>
  );
};
