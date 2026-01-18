'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import type { GuestbookEntry, InvitationGuestbook } from '@/mock/invitation.mock';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { PasswordModal } from '@/components/ui/PasswordModal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextArea, TextInput } from '@/components/ui/TextInput';
import { Toast } from '@/components/ui/Toast';
import { formatMonthDay } from '@/utils/date';
import { isFourDigitPassword, isRequiredText } from '@/utils/validation';
import { postJson } from '@/utils/api';

type GuestbookSectionProps = {
  guestbook: InvitationGuestbook;
  storageKey: string;
  title: string;
};

// 간단한 비밀번호 해시 (SHA-256)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'wedding-salt-2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const inputHash = await hashPassword(password);
  return inputHash === hash;
};

// localStorage 유틸리티
const loadEntries = (storageKey: string): GuestbookEntry[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveEntries = (storageKey: string, entries: GuestbookEntry[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save guestbook entries:', e);
  }
};

/**
 * 방명록 섹션
 * @param props GuestbookSectionProps
 * @returns JSX.Element
 */
export const GuestbookSection = ({ guestbook, storageKey, title }: GuestbookSectionProps) => {
  // 폼 상태
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');
  const [targetEntry, setTargetEntry] = useState<GuestbookEntry | null>(null);
  const [actionType, setActionType] = useState<'edit' | 'delete' | null>(null);

  // 수정 모달 상태
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editMessage, setEditMessage] = useState('');

  // 토스트
  const [toast, setToast] = useState<string | null>(null);

  // 초기 로딩: localStorage + mock 데이터 병합
  useEffect(() => {
    const stored = loadEntries(storageKey);
    const mockIds = new Set(guestbook.mockEntries.map((e) => e.id));
    const userEntries = stored.filter((e) => !mockIds.has(e.id));
    setEntries([...guestbook.mockEntries, ...userEntries]);
    setIsLoaded(true);
  }, [guestbook.mockEntries, storageKey]);

  // entries 변경 시 localStorage 저장 (mock 제외)
  useEffect(() => {
    if (!isLoaded) return;
    const mockIds = new Set(guestbook.mockEntries.map((e) => e.id));
    const userEntries = entries.filter((e) => !mockIds.has(e.id));
    saveEntries(storageKey, userEntries);
  }, [entries, isLoaded, guestbook.mockEntries, storageKey]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const isValid = useMemo(() => {
    const hasPassword = !guestbook.enablePassword || isFourDigitPassword(password);
    return isRequiredText(name) && isRequiredText(message) && consent && hasPassword;
  }, [name, message, consent, password, guestbook.enablePassword]);

  const formatDate = useCallback((value: string) => {
    return formatMonthDay(value);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isValid) return;

      const id =
        typeof globalThis.crypto?.randomUUID === 'function'
          ? globalThis.crypto.randomUUID()
          : `guest-${Date.now()}`;

      const passwordHash = guestbook.enablePassword ? await hashPassword(password) : '';

      const newEntry: GuestbookEntry = {
        id,
        name: name.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
        passwordHash,
      };

      setEntries((prev) => [newEntry, ...prev]);
      try {
        const response = await postJson('/api/guestbook', newEntry);
        if (!response.ok) {
          throw new Error('Guestbook request failed');
        }
      } catch (error) {
        console.error('Guestbook submit error:', error);
      }
      setName('');
      setPassword('');
      setMessage('');
      setConsent(false);
      setPage(1);
      showToast('메시지가 등록되었습니다');
    },
    [isValid, name, message, password, guestbook.enablePassword, showToast]
  );

  const handleEditClick = useCallback((entry: GuestbookEntry) => {
    // Mock 데이터는 수정 불가
    if (!entry.passwordHash) {
      return;
    }
    setTargetEntry(entry);
    setActionType('edit');
    setModalError('');
    setModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((entry: GuestbookEntry) => {
    // Mock 데이터는 삭제 불가
    if (!entry.passwordHash) {
      return;
    }
    setTargetEntry(entry);
    setActionType('delete');
    setModalError('');
    setModalOpen(true);
  }, []);

  const handlePasswordConfirm = useCallback(
    async (inputPassword: string) => {
      if (!targetEntry || !targetEntry.passwordHash) return;

      const isMatch = await verifyPassword(inputPassword, targetEntry.passwordHash);
      if (!isMatch) {
        setModalError('비밀번호가 일치하지 않습니다');
        return;
      }

      setModalOpen(false);
      setModalError('');

      if (actionType === 'delete') {
        setEntries((prev) => prev.filter((e) => e.id !== targetEntry.id));
        showToast('메시지가 삭제되었습니다');
        setTargetEntry(null);
        setActionType(null);
      } else if (actionType === 'edit') {
        setEditName(targetEntry.name);
        setEditMessage(targetEntry.message);
        setEditModalOpen(true);
      }
    },
    [targetEntry, actionType, showToast]
  );

  const handleEditSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!targetEntry || !editName.trim() || !editMessage.trim()) return;

      setEntries((prev) =>
        prev.map((e) =>
          e.id === targetEntry.id
            ? { ...e, name: editName.trim(), message: editMessage.trim() }
            : e
        )
      );

      setEditModalOpen(false);
      setTargetEntry(null);
      setActionType(null);
      showToast('메시지가 수정되었습니다');
    },
    [targetEntry, editName, editMessage, showToast]
  );

  const sortedEntries = useMemo(() => {
    return [...entries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [entries]);

  const pageSize = Math.max(1, guestbook.pageSize || 5);
  const totalPages = Math.max(1, Math.ceil(sortedEntries.length / pageSize));
  const clampedPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page !== clampedPage) {
      setPage(clampedPage);
    }
  }, [page, clampedPage]);

  const paginatedEntries = sortedEntries.slice(
    (clampedPage - 1) * pageSize,
    clampedPage * pageSize
  );
  const recentEntries = sortedEntries.slice(0, pageSize);
  const displayEntries = guestbook.displayMode === 'paginated' ? paginatedEntries : recentEntries;

  return (
    <>
      <section id="guestbook" className="bg-[var(--bg-primary)] py-16">
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8 px-6">
          <div className="text-center" data-animate="fade-up">
            <SectionHeader
              kicker="GUESTBOOK"
              title={title}
              description={guestbook.retentionText}
              kickerClassName="font-label text-[12px] text-[var(--accent-rose)]"
              titleClassName="mt-2 text-[24px] font-medium text-[var(--text-primary)]"
              descriptionClassName="mt-2 text-[14px] text-[var(--text-tertiary)]"
            />
          </div>

          <SurfaceCard
            as="form"
            className="flex flex-col gap-4 p-5"
            onSubmit={handleSubmit}
            data-animate="fade-up"
          >
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="guest-name">NAME</FieldLabel>
              <TextInput
                id="guest-name"
                name="guest-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="성함을 입력해주세요"
                maxLength={20}
                required
              />
            </div>

            {guestbook.enablePassword && (
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="guest-password">PASSWORD</FieldLabel>
                <TextInput
                  id="guest-password"
                  name="guest-password"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={password}
                  onChange={(event) => setPassword(event.target.value.replace(/\D/g, ''))}
                  placeholder="4자리 숫자 (수정/삭제 시 필요)"
                  required
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="guest-message">MESSAGE</FieldLabel>
              <TextArea
                id="guest-message"
                name="guest-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="min-h-[100px]"
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

            <Button type="submit" size="full" disabled={!isValid}>
              축하 메시지 남기기
            </Button>
          </SurfaceCard>

          <div className="flex flex-col gap-3" data-animate="stagger">
            {guestbook.displayMode === 'recent' && (
              <p
                className="rounded-[12px] bg-[var(--bg-secondary)] px-4 py-3 text-center text-[12px] text-[var(--text-muted)]"
                data-animate-item
              >
                {guestbook.recentNotice}
              </p>
            )}

            {displayEntries.map((entry) => {
              const canModify = !!entry.passwordHash;
              const isActive = activeEntryId === entry.id;

              return (
                <SurfaceCard
                  key={entry.id}
                  className="group relative overflow-hidden px-4 py-4"
                  data-animate-item
                  onMouseEnter={() => {
                    if (canModify) {
                      setActiveEntryId(entry.id);
                    }
                  }}
                  onMouseLeave={() => {
                    if (canModify) {
                      setActiveEntryId((prev) => (prev === entry.id ? null : prev));
                    }
                  }}
                  onClick={() => {
                    if (canModify) {
                      setActiveEntryId((prev) => (prev === entry.id ? null : entry.id));
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-medium text-[var(--text-primary)]">
                      {entry.name}
                    </p>
                    <span className="text-[12px] text-[var(--text-muted)]">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
                    {entry.message}
                  </p>

                  {canModify && (guestbook.enableEdit || guestbook.enableDelete) && (
                    <div
                      className={`pointer-events-none absolute inset-0 flex items-center justify-center transition ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      } group-hover:opacity-100 group-focus-within:opacity-100`}
                    >
                      <div className="absolute inset-0 bg-[#2c2420]/45 backdrop-blur-[1px]" />
                      <div className="relative z-10 flex gap-3">
                        {guestbook.enableEdit && (
                          <Button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleEditClick(entry);
                            }}
                            variant="ghost"
                            size="pill"
                            className="pointer-events-auto border-white/70 bg-white/90 text-[var(--text-primary)] shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:border-white hover:bg-white"
                          >
                            수정
                          </Button>
                        )}
                        {guestbook.enableDelete && (
                          <Button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteClick(entry);
                            }}
                            variant="danger"
                            size="pill"
                            className="pointer-events-auto border-white/70 bg-white/90 shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                          >
                            삭제
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </SurfaceCard>
              );
            })}
          </div>

          {guestbook.displayMode === 'paginated' && (
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
          )}
        </div>
      </section>

      {/* 비밀번호 확인 모달 */}
      <PasswordModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setTargetEntry(null);
          setActionType(null);
          setModalError('');
        }}
        onConfirm={handlePasswordConfirm}
        title={actionType === 'delete' ? '삭제 비밀번호 확인' : '수정 비밀번호 확인'}
        error={modalError}
      />

      {/* 수정 모달 */}
      {editModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditModalOpen(false);
              setTargetEntry(null);
              setActionType(null);
            }
          }}
        >
          <div className="w-full max-w-[360px] rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-card)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[18px] font-medium text-[var(--text-primary)]">메시지 수정</h3>
              <button
                type="button"
                onClick={() => {
                  setEditModalOpen(false);
                  setTargetEntry(null);
                  setActionType(null);
                }}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="edit-name">NAME</FieldLabel>
                <TextInput
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={20}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="edit-message">MESSAGE</FieldLabel>
                <TextArea
                  id="edit-message"
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="min-h-[100px]"
                  maxLength={200}
                  required
                />
              </div>

              <Button
                type="submit"
                size="full"
                disabled={!editName.trim() || !editMessage.trim()}
              >
                수정 완료
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* 토스트 메시지 */}
      <Toast isOpen={!!toast} message={toast} />
    </>
  );
};
