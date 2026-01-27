'use client';

import dynamic from 'next/dynamic';
import { useAdminStore } from '@/stores/adminStore';

/**
 * 섹션 로딩 스켈레톤
 * @param props { title: string }
 * @returns JSX.Element
 */
const SectionSkeleton = ({ title }: { title: string }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
    </div>
    <div className="space-y-4">
      <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-10 bg-slate-200 rounded animate-pulse" />
        <div className="h-10 bg-slate-200 rounded animate-pulse" />
        <div className="h-10 bg-slate-200 rounded animate-pulse" />
        <div className="h-10 bg-slate-200 rounded animate-pulse" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-9 w-24 bg-slate-200 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

// 동적 임포트로 성능 최적화
const AdminSectionOverview = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionOverview')
    .then(m => ({ default: m.AdminSectionOverview })),
  { loading: () => <SectionSkeleton title="대시보드 요약" /> }
);

const AdminSectionBasic = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionBasic')
    .then(m => ({ default: m.AdminSectionBasic })),
  { loading: () => <SectionSkeleton title="기본 정보" /> }
);

const AdminSectionLoading = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionLoading')
    .then(m => ({ default: m.AdminSectionLoading })),
  { loading: () => <SectionSkeleton title="로딩 섹션" /> }
);

const AdminSectionIntro = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionIntro')
    .then(m => ({ default: m.AdminSectionIntro })),
  { loading: () => <SectionSkeleton title="인트로 섹션" /> }
);

const AdminSectionCouple = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionCouple')
    .then(m => ({ default: m.AdminSectionCouple })),
  { loading: () => <SectionSkeleton title="커플 섹션" /> }
);

const AdminSectionLocation = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionLocation')
    .then(m => ({ default: m.AdminSectionLocation })),
  { loading: () => <SectionSkeleton title="예식 정보 & 오시는 길" /> }
);

const AdminSectionGallery = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionGallery')
    .then(m => ({ default: m.AdminSectionGallery })),
  { loading: () => <SectionSkeleton title="갤러리 섹션" /> }
);

const AdminSectionAccounts = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionAccounts')
    .then(m => ({ default: m.AdminSectionAccounts })),
  { loading: () => <SectionSkeleton title="계좌 섹션" /> }
);

const AdminSectionGuestbook = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionGuestbook')
    .then(m => ({ default: m.AdminSectionGuestbook })),
  { loading: () => <SectionSkeleton title="게스트북 섹션" /> }
);

const AdminSectionRsvp = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionRsvp')
    .then(m => ({ default: m.AdminSectionRsvp })),
  { loading: () => <SectionSkeleton title="RSVP 섹션" /> }
);

const AdminSectionShare = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionShare')
    .then(m => ({ default: m.AdminSectionShare })),
  { loading: () => <SectionSkeleton title="공유 섹션" /> }
);

const AdminSectionClosing = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionClosing')
    .then(m => ({ default: m.AdminSectionClosing })),
  { loading: () => <SectionSkeleton title="마무리 인사말" /> }
);

const AdminSectionBgm = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionBgm')
    .then(m => ({ default: m.AdminSectionBgm })),
  { loading: () => <SectionSkeleton title="BGM 섹션" /> }
);

/**
 * 관리자 컨텐츠 라우터
 * activeTab에 따라 적절한 섹션 컴포넌트를 렌더링
 * @returns JSX.Element
 */
export const AdminContentRouter = () => {
  const { activeTab, data } = useAdminStore();

  if (!data) {
    return <SectionSkeleton title="데이터 로딩 중..." />;
  }

  switch (activeTab) {
    case 'overview':
      return <AdminSectionOverview overview={data.overview} />;
    
    case 'basic':
      return <AdminSectionBasic data={data} />;
    
    case 'loading':
      return (
        <AdminSectionLoading
          loading={data.loading}
          assets={data.assets}
          fileUrlToNameMap={data.fileUrlToNameMap}
          sectionTitle={data.sectionTitles.loading}
        />
      );
    
    case 'intro':
      return (
        <AdminSectionIntro
          assets={data.assets}
          greeting={data.greeting}
          sectionTitles={data.sectionTitles}
          fileUrlToNameMap={data.fileUrlToNameMap}
        />
      );
    
    case 'couple':
      return (
        <AdminSectionCouple
          profile={data.profile}
          sectionTitles={data.sectionTitles}
          fileUrlToNameMap={data.fileUrlToNameMap}
        />
      );
    
    case 'location':
      return <AdminSectionLocation data={data} />;
    
    case 'gallery':
      return (
        <AdminSectionGallery
          gallery={data.gallery}
          initialGalleryItems={data.galleryImages}
          galleryItems={data.galleryImages}
          setGalleryItems={() => {}}
          draggedImageId={null}
          setDraggedImageId={() => {}}
          dragOverImageId={null}
          setDragOverImageId={() => {}}
          orderSaved={false}
          setOrderSaved={() => {}}
        />
      );
    
    case 'accounts':
      return (
        <AdminSectionAccounts
          accounts={data.accounts}
          groomEntries={data.accountEntries.filter((entry) => entry.group_type === 'groom')}
          brideEntries={data.accountEntries.filter((entry) => entry.group_type === 'bride')}
          accountFormOpen={{ groom: false, bride: false }}
          setAccountFormOpen={() => {}}
        />
      );
    
    case 'guestbook':
      return (
        <AdminSectionGuestbook
          guestbook={data.guestbook}
          guestbookEntries={data.guestbookEntries}
          sectionTitles={data.sectionTitles}
          guestbookPage={1}
          setGuestbookPage={() => {}}
        />
      );
    
    case 'rsvp':
      return (
        <AdminSectionRsvp
          rsvp={data.rsvp}
          rsvpResponses={data.rsvpResponses}
          sectionTitles={data.sectionTitles}
          rsvpPage={1}
          setRsvpPage={() => {}}
        />
      );
    
    case 'share':
      return (
        <AdminSectionShare
          share={data.share}
          assets={data.assets}
          fileUrlToNameMap={data.fileUrlToNameMap}
        />
      );
    
    case 'closing':
      return <AdminSectionClosing closing={data.closing} />;
    
    case 'bgm':
      return <AdminSectionBgm bgm={data.bgm} />;
    
    default:
      return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <p className="text-slate-500">선택된 섹션을 찾을 수 없습니다.</p>
        </div>
      );
  }
};