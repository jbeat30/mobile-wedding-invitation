'use client';

import { useCallback, useMemo, useState, type FormEvent } from 'react';
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
    },
    [isValid, name, message]
  );

  return (
    <section id="guestbook" className="bg-white">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6 py-16">
        <div className="text-center">
          <span className="text-[11px] tracking-[0.35em] text-[var(--muted)]">GUESTBOOK</span>
          <h2 className="mt-3 text-[24px] font-semibold text-[#3b3b3b]">축하 메시지</h2>
          <p className="mt-2 text-[14px] text-[#6f6a62]">{guestbook.retentionText}</p>
        </div>

        <form
          className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-black/5 bg-[#faf7f2] p-6 shadow-[0_16px_40px_rgba(24,24,24,0.08)]"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label className="text-[12px] tracking-[0.3em] text-[var(--muted)]" htmlFor="guest-name">
              NAME
            </label>
            <input
              id="guest-name"
              name="guest-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-[12px] border border-black/10 bg-white px-4 py-3 text-[14px] text-[#3b3b3b] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/40"
              placeholder="성함을 입력해주세요"
              maxLength={20}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-[12px] tracking-[0.3em] text-[var(--muted)]"
              htmlFor="guest-message"
            >
              MESSAGE
            </label>
            <textarea
              id="guest-message"
              name="guest-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-[120px] rounded-[12px] border border-black/10 bg-white px-4 py-3 text-[14px] text-[#3b3b3b] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/40"
              placeholder="축하의 한마디를 남겨주세요"
              maxLength={200}
              required
            />
          </div>
          <label className="flex items-start gap-3 rounded-[12px] border border-black/5 bg-white px-4 py-3 text-[12px] text-[#6f6a62]">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-[3px] h-4 w-4 accent-[var(--accent-strong)]"
            />
            <span>
              {guestbook.privacyNotice}
              <span className="block text-[11px] text-[#8a847a]">{guestbook.retentionText}</span>
            </span>
          </label>
          <button
            type="submit"
            className="rounded-full bg-[#2f2f2f] py-3 text-[14px] font-medium text-white transition disabled:bg-[#c8c4be]"
            disabled={!isValid}
          >
            축하 메시지 남기기
          </button>
        </form>

        <div className="flex flex-col gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-[20px] border border-black/5 bg-white px-5 py-4 shadow-[0_12px_30px_rgba(22,22,22,0.06)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium text-[#3b3b3b]">{entry.name}</p>
                <span className="text-[11px] text-[#9c958a]">{formatDate(entry.createdAt)}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[#57524a]">{entry.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
