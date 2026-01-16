'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { invitationMock } from '@/mock/invitation.mock';

type GuestbookEntryView = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

/**
 * 방명록 섹션 구성 확인
 */
export const GuestbookSection = () => {
  const { guestbook } = invitationMock;
  const [entries, setEntries] = useState<GuestbookEntryView[]>(guestbook.mockEntries);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [page, setPage] = useState(1);

  const isValid = useMemo(() => {
    return name.trim().length > 0 && message.trim().length > 0 && consent;
  }, [name, message, consent]);

  const formatDate = useCallback((value: string) => {
    const date = new Date(value);
    const formatter = new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
    return formatter.format(date);
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isValid) return;

      const id =
        typeof globalThis.crypto?.randomUUID === 'function'
          ? globalThis.crypto.randomUUID()
          : `guest-${Date.now()}`;

      setEntries((prev) => [
        {
          id,
          name: name.trim(),
          message: message.trim(),
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setName('');
      setMessage('');
      setConsent(false);
      setPage(1);
    },
    [isValid, name, message]
  );

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [entries]);

  const pageSize = Math.max(1, guestbook.pageSize || 5);
  const totalPages = Math.max(1, Math.ceil(sortedEntries.length / pageSize));
  const clampedPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page !== clampedPage) {
      setPage(clampedPage);
    }
  }, [page, clampedPage]);

  const paginatedEntries = sortedEntries.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);
  const recentEntries = sortedEntries.slice(0, pageSize);

  return (
    <section id="guestbook" className="bg-[var(--bg-primary)] py-16">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8 px-6">
        <div className="text-center" data-animate="fade-up">
          <span className="font-label text-[11px] text-[var(--text-muted)]">GUESTBOOK</span>
          <h2 className="mt-2 text-[24px] font-medium text-[var(--text-primary)]">
            축하 메시지
          </h2>
          <p className="mt-2 text-[14px] text-[var(--text-tertiary)]">{guestbook.retentionText}</p>
        </div>

        <form
          className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--card-border)] bg-white/70 p-5 shadow-[var(--shadow-soft)]"
          onSubmit={handleSubmit}
          data-animate="fade-up"
        >
          <div className="flex flex-col gap-2">
            <label className="font-label text-[10px] text-[var(--text-muted)]" htmlFor="guest-name">
              NAME
            </label>
            <input
              id="guest-name"
              name="guest-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-[12px] border border-[var(--border-light)] bg-white px-4 py-3 text-[14px] text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
              placeholder="성함을 입력해주세요"
              maxLength={20}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="font-label text-[10px] text-[var(--text-muted)]"
              htmlFor="guest-message"
            >
              MESSAGE
            </label>
            <textarea
              id="guest-message"
              name="guest-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-[100px] rounded-[12px] border border-[var(--border-light)] bg-white px-4 py-3 text-[14px] text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
              placeholder="축하의 한마디를 남겨주세요"
              maxLength={200}
              required
            />
          </div>
          <label className="flex items-start gap-3 rounded-[12px] bg-[var(--bg-secondary)] px-4 py-3 text-[12px] text-[var(--text-muted)]">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-[3px] h-4 w-4 accent-[var(--accent-burgundy)]"
            />
            <span>{guestbook.privacyNotice}</span>
          </label>
          <button
            type="submit"
            className="rounded-full bg-[var(--accent-burgundy)] py-3 text-[14px] text-white transition hover:opacity-90 disabled:bg-[var(--bg-tertiary)] disabled:text-[var(--text-muted)]"
            disabled={!isValid}
          >
            축하 메시지 남기기
          </button>
        </form>

        <div className="flex flex-col gap-3" data-animate="stagger">
          {guestbook.displayMode === 'recent' && (
            <p
              className="rounded-[12px] bg-[var(--bg-secondary)] px-4 py-3 text-center text-[12px] text-[var(--text-muted)]"
              data-animate-item
            >
              {guestbook.recentNotice}
            </p>
          )}

          {(guestbook.displayMode === 'paginated' ? paginatedEntries : recentEntries).map((entry) => (
            <div
              key={entry.id}
              className="rounded-[var(--radius-md)] border border-[var(--card-border)] bg-white/70 px-4 py-4 shadow-[var(--shadow-soft)]"
              data-animate-item
            >
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium text-[var(--text-primary)]">{entry.name}</p>
                <span className="text-[12px] text-[var(--text-muted)]">{formatDate(entry.createdAt)}</span>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
                {entry.message}
              </p>
            </div>
          ))}
        </div>

        {guestbook.displayMode === 'paginated' ? (
          <div
            className="flex items-center justify-center gap-4 rounded-[16px] border border-white/70 bg-white/80 px-4 py-3 text-[12px] text-[var(--text-muted)] shadow-[0_12px_24px_rgba(41,32,26,0.1)]"
            data-animate="fade-up"
          >
            <button
              type="button"
              className="rounded-full border border-[var(--accent-soft)] px-3 py-1 text-[12px] text-[var(--text-secondary)] transition disabled:opacity-40"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={clampedPage === 1}
              aria-label="이전 페이지"
            >
              이전
            </button>
            <span>
              {clampedPage} / {totalPages}
            </span>
            <button
              type="button"
              className="rounded-full border border-[var(--accent-soft)] px-3 py-1 text-[12px] text-[var(--text-secondary)] transition disabled:opacity-40"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={clampedPage === totalPages}
              aria-label="다음 페이지"
            >
              다음
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};
