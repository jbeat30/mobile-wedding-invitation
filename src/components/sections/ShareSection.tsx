'use client';

import { useCallback, useState, useEffect } from 'react';
import type { InvitationShare } from '@/mock/invitation.mock';
import { useKakaoSDK } from '@/hooks/useKakaoSDK';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Toast } from '@/components/ui/Toast';
import { copyText } from '@/utils/clipboard';

/**
 * 공유 기능 섹션
 * - 카카오톡 공유 (NEXT_PUBLIC_KAKAO_APP_KEY가 있을 때만 활성화)
 * - URL 복사
 * - Web Share API (네이티브 공유)
 */
type ShareSectionProps = {
  share: InvitationShare;
  title: string;
};

export const ShareSection = ({ share, title }: ShareSectionProps) => {
  const { isReady: isKakaoReady, hasAppKey } = useKakaoSDK();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [canShare, setCanShare] = useState(false);

  // Web Share API 지원 여부 체크 (클라이언트 마운트 후)
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  // 현재 페이지 URL
  const getCurrentUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  }, []);

  // 토스트 표시
  const showToastMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }, []);

  // 카카오톡 공유
  const handleKakaoShare = useCallback(() => {
    if (!isKakaoReady || !window.Kakao) {
      showToastMessage('카카오톡 공유 기능을 사용할 수 없습니다');
      return;
    }

    const template = share.kakaoTemplate
      ? {
          ...share.kakaoTemplate,
          imageUrl: share.kakaoTemplate.imageUrl || share.imageUrl,
        }
      : {
          title: share.title,
          description: share.description,
          imageUrl: share.imageUrl,
          buttonLabel: '청첩장 보기',
        };

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: template.title,
          description: template.description,
          imageUrl: template.imageUrl,
          link: {
            mobileWebUrl: getCurrentUrl(),
            webUrl: getCurrentUrl(),
          },
        },
        buttons: [
          {
            title: template.buttonLabel || '청첩장 보기',
            link: {
              mobileWebUrl: getCurrentUrl(),
              webUrl: getCurrentUrl(),
            },
          },
        ],
      });
    } catch (error) {
      console.error('Kakao share error:', error);
      showToastMessage('카카오톡 공유에 실패했습니다');
    }
  }, [isKakaoReady, share, getCurrentUrl, showToastMessage]);

  // URL 복사
  const handleCopyUrl = useCallback(async () => {
    const url = getCurrentUrl();
    try {
      await copyText(url);
      showToastMessage('링크가 복사되었습니다');
    } catch (error) {
      console.error('Copy URL error:', error);
      showToastMessage('링크 복사에 실패했습니다');
    }
  }, [getCurrentUrl, showToastMessage]);

  // 네이티브 공유 (Web Share API)
  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) {
      showToastMessage('이 브라우저는 공유 기능을 지원하지 않습니다');
      return;
    }

    try {
      await navigator.share({
        title: share.title,
        text: share.description,
        url: getCurrentUrl(),
      });
    } catch (error: unknown) {
      // 사용자가 취소한 경우 (AbortError)는 토스트 표시하지 않음
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Native share error:', error);
        showToastMessage('공유에 실패했습니다');
      }
    }
  }, [share, getCurrentUrl, showToastMessage]);

  return (
    <>
      <section
        id="share"
        className="bg-[var(--bg-primary)] py-12"
      >
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8 px-6">
          {/* 섹션 헤더 */}
          <div className="text-center" data-animate="fade-up">
            <SectionHeader
              kicker="SHARE"
              title={title}
              description="소중한 분들과 함께 나눠주세요"
              kickerClassName="font-label text-[14px] text-[var(--accent-rose)]"
              titleClassName="mt-2 text-[24px] font-medium text-[var(--text-primary)]"
              descriptionClassName="mt-2 text-[14px] text-[var(--text-tertiary)]"
            />
          </div>

          {/* 공유 버튼 그룹 */}
          <div className="flex flex-col gap-3" data-animate="stagger">
            {/* 카카오톡 공유 */}
            <Button
              onClick={handleKakaoShare}
              disabled={!hasAppKey || !isKakaoReady}
              data-animate-item
              size="full"
              className="relative flex items-center justify-center gap-3 bg-[#FEE500] py-3.5 text-[14px] font-medium text-[#3C1E1E] shadow-[var(--shadow-soft)] hover:bg-[#FDD835]"
              title={
                !hasAppKey
                  ? '카카오 API 키가 설정되지 않았습니다'
                  : !isKakaoReady
                    ? '카카오 SDK 로딩 중...'
                    : ''
              }
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.89 2.06 5.43 5.18 6.87-.2.74-.74 2.67-.85 3.1-.13.49.17.48.36.35.14-.09 2.26-1.54 3.62-2.47.52.07 1.05.11 1.59.11C17.52 19 22 15.42 22 11S17.52 3 12 3z" />
              </svg>
              카카오톡으로 공유하기
              {!hasAppKey && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-[#3C1E1E]/50">
                  (API 키 필요)
                </span>
              )}
            </Button>

            {/* URL 복사 */}
            <Button
              onClick={handleCopyUrl}
              data-animate-item
              size="full"
              variant="ghost"
              className="flex items-center justify-center gap-3 border-[var(--accent)] bg-white py-3.5 text-[14px] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              링크 복사하기
            </Button>

            {/* 네이티브 공유 */}
            {canShare && (
              <Button
                onClick={handleNativeShare}
                data-animate-item
                size="full"
                variant="ghost"
                className="flex items-center justify-center gap-3 bg-white py-3.5 text-[14px] text-[var(--text-secondary)]"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                다른 방법으로 공유하기
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 토스트 메시지 */}
      <Toast isOpen={showToast} message={toastMessage} />
    </>
  );
};
