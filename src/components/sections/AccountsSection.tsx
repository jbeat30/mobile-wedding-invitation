'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { InvitationAccounts } from '@/mock/invitation.mock';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Toast } from '@/components/ui/Toast';
import { copyText } from '@/utils/clipboard';

type AccountsSectionProps = {
  accounts: InvitationAccounts;
};

type ToastState = {
  message: string;
};

const BANK_ICON_MAP: Record<string, { path: string; alt: string }> = {
  국민은행: { path: '/icon/bank/kb-kookmin/original.jpg', alt: 'KB국민은행' },
  KB국민은행: { path: '/icon/bank/kb-kookmin/original.jpg', alt: 'KB국민은행' },
  신한은행: { path: '/icon/bank/shinhan/original.jpg', alt: '신한은행' },
  KEB하나은행: { path: '/icon/bank/hana/original.jpg', alt: '하나은행' },
  하나은행: { path: '/icon/bank/hana/original.jpg', alt: '하나은행' },
  우리은행: { path: '/icon/bank/woori/original.jpg', alt: '우리은행' },
  IBK기업은행: { path: '/icon/bank/ibk/original.jpg', alt: 'IBK기업은행' },
  KDB산업은행: { path: '/icon/bank/kdb/original.jpg', alt: 'KDB산업은행' },
  SC제일은행: { path: '/icon/bank/sc-first/original.jpg', alt: 'SC제일은행' },
  iM뱅크: { path: '/icon/bank/im-bank/original.jpg', alt: 'iM뱅크' },
  카카오뱅크: { path: '/icon/bank/kakao-bank/original.jpg', alt: '카카오뱅크' },
  케이뱅크: { path: '/icon/bank/k-bank/original.jpg', alt: '케이뱅크' },
  토스뱅크: { path: '/icon/bank/toss-bank/original.jpg', alt: '토스뱅크' },
  씨티은행: { path: '/icon/bank/citi-bank/original.jpg', alt: '씨티은행' },
  시티은행: { path: '/icon/bank/citi-bank/original.jpg', alt: '씨티은행' },
  NH농협은행: { path: '/icon/bank/nh-bank/original.jpg', alt: 'NH농협은행' },
  수협은행: { path: '/icon/bank/suhyup-bank/original.jpg', alt: '수협은행' },
  신협: { path: '/icon/bank/shinhyup/mono.jpg', alt: '신협' },
  우체국: { path: '/icon/bank/korea-post/mono.jpg', alt: '우체국' },
  부산은행: { path: '/icon/bank/busan-bank/original.jpg', alt: '부산은행' },
  경남은행: { path: '/icon/bank/kyongnam-bank/original.jpg', alt: '경남은행' },
  제주은행: { path: '/icon/bank/jeju-bank/original.jpg', alt: '제주은행' },
  광주은행: { path: '/icon/bank/gwangju-bank/original.jpg', alt: '광주은행' },
  전북은행: { path: '/icon/bank/jeonbuk-bank/original.jpg', alt: '전북은행' },
  SBI저축은행: { path: '/icon/bank/sbi-savings/original.jpg', alt: 'SBI저축은행' },
};

/**
 * 은행명에 맞는 아이콘 정보를 반환합니다.
 */
const getBankIcon = (bankName: string) => BANK_ICON_MAP[bankName] ?? null;

/**
 * 계좌 안내 섹션 구성 확인
 */
export const AccountsSection = ({ accounts }: AccountsSectionProps) => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const sections = useMemo(
    () => [
      { title: '신랑측', entries: accounts.groom },
      { title: '신부측', entries: accounts.bride },
    ],
    [accounts]
  );

  /**
   * 클립보드 복사 처리 확인
   */
  const copyToClipboard = useCallback(async (name: string, text: string) => {
    try {
      await copyText(text);
      setToast({ message: `${name} 계좌번호가 복사되었습니다` });
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
    <section id="accounts" className="bg-[var(--bg-primary)] py-12">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8 px-6">
        <div className="text-center" data-animate="fade-up" data-animate-trigger="section">
          <SectionHeader
            kicker="ACCOUNTS"
            title={accounts.title}
            description={accounts.description}
            kickerClassName="font-label text-[14px] text-[var(--accent-rose)]"
            titleClassName="mt-2 text-[24px] font-medium text-[var(--text-primary)]"
            descriptionClassName="mt-2 text-[14px] text-[var(--text-tertiary)]"
          />
        </div>

        <Accordion type="single" collapsible className="flex flex-col gap-5" data-animate="stagger">
          {sections.map((section) => (
            <AccordionItem key={section.title} value={section.title} data-animate-item>
              <AccordionTrigger>{section.title}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3">
                  {section.entries.map((entry) => {
                    const bankIcon = getBankIcon(entry.bankName);

                    return (
                      <div
                        key={`${section.title}-${entry.accountNumber}`}
                        className="flex items-center justify-between gap-4 rounded-[14px] border border-[var(--card-border)] bg-white px-4 py-3 shadow-[var(--shadow-soft)]"
                      >
                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[15px] font-semibold text-[var(--accent-rose-dark)]">
                              {[`[${entry.label}]`, entry.holder].filter(Boolean).join(' ')}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(entry.bankName, entry.accountNumber)}
                              className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-[var(--border-light)] bg-white text-[var(--text-secondary)] shadow-[var(--shadow-soft)] transition hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
                              aria-label="계좌번호 복사"
                            >
                              <svg
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                              >
                                <rect x="9" y="9" width="10" height="10" rx="2" />
                                <path d="M5 15V7a2 2 0 0 1 2-2h8" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--text-muted)]">
                            <span className="text-[15px] text-[var(--text-primary)]">
                              {entry.accountNumber}
                            </span>
                            <span className="text-[12px] text-[var(--text-muted)]">/</span>
                            {bankIcon ? (
                              <span className="flex items-center gap-1.5">
                                <Image
                                  src={bankIcon.path}
                                  alt={bankIcon.alt}
                                  width={16}
                                  height={16}
                                  className="h-4 w-4 rounded-full object-cover"
                                />
                                <span>{entry.bankName}</span>
                              </span>
                            ) : (
                              <span>{entry.bankName}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <Toast isOpen={!!toast} message={toast?.message} toastClassName="py-2" />
    </section>
  );
};
