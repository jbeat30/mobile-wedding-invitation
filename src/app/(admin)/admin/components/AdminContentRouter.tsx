'use client';

import { useAdminStore } from '@/stores/adminStore';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// 스켈레톤 로더
const SectionSkeleton = ({ title: _title }: { title: string }) => (
  <div className="p-8">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

// 동적 임포트
const AdminSectionOverview = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionOverviewStandard')
    .then(m => ({ default: m.AdminSectionOverview })),
  { loading: () => <SectionSkeleton title="대시보드" /> }
);

const AdminSectionIntro = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionIntro')
    .then(m => ({ default: m.AdminSectionIntro })),
  { loading: () => <SectionSkeleton title="인트로" /> }
);

const AdminSectionLoading = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionLoading')
    .then(m => ({ default: m.AdminSectionLoading })),
  { loading: () => <SectionSkeleton title="로딩" /> }
);

const AdminSectionCouple = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionCouple')
    .then(m => ({ default: m.AdminSectionCouple })),
  { loading: () => <SectionSkeleton title="커플 정보" /> }
);

const AdminSectionLocation = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionVenue')
    .then(m => ({ default: m.AdminSectionVenue })),
  { loading: () => <SectionSkeleton title="예식장 정보" /> }
);

const AdminSectionGallery = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionGallery')
    .then(m => ({ default: m.AdminSectionGallery })),
  { loading: () => <SectionSkeleton title="갤러리" /> }
);

const AdminSectionAccounts = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionAccounts')
    .then(m => ({ default: m.AdminSectionAccounts })),
  { loading: () => <SectionSkeleton title="계좌 정보" /> }
);

const AdminSectionGuestbook = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionGuestbook')
    .then(m => ({ default: m.AdminSectionGuestbook })),
  { loading: () => <SectionSkeleton title="방명록" /> }
);

const AdminSectionRsvp = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionRsvp')
    .then(m => ({ default: m.AdminSectionRsvp })),
  { loading: () => <SectionSkeleton title="RSVP" /> }
);

const AdminSectionShare = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionShare')
    .then(m => ({ default: m.AdminSectionShare })),
  { loading: () => <SectionSkeleton title="공유 설정" /> }
);

const AdminSectionBgm = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionBgm')
    .then(m => ({ default: m.AdminSectionBgm })),
  { loading: () => <SectionSkeleton title="BGM" /> }
);

const AdminSectionClosing = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionClosing')
    .then(m => ({ default: m.AdminSectionClosing })),
  { loading: () => <SectionSkeleton title="마무리 인사" /> }
);

/**
 * 관리자 컨텐츠 라우터
 */
export const AdminContentRouter = () => {
  const { activeTab, data } = useAdminStore();
  const [accountFormOpen, setAccountFormOpen] = useState({ groom: false, bride: false });

  if (!data) {
    return <SectionSkeleton title="데이터 로딩 중..." />;
  }

  switch (activeTab) {
    case 'overview':
      return <AdminSectionOverview overview={data.overview} />;
    
    case 'basic':
      return (
        <AdminSectionCouple
          profile={data.profile}
          parents={data.parents}
          sectionTitles={data.sectionTitles}
          fileUrlToNameMap={data.fileUrlToNameMap}
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
    
    case 'loading':
      return (
        <AdminSectionLoading
          loading={data.loading}
          assets={data.assets}
          sectionTitle={data.sectionTitles.loading}
          fileUrlToNameMap={data.fileUrlToNameMap}
        />
      );
    
    case 'couple':
      return (
        <AdminSectionCouple
          profile={data.profile}
          parents={data.parents}
          sectionTitles={data.sectionTitles}
          fileUrlToNameMap={data.fileUrlToNameMap}
        />
      );
    
    case 'location':
    case 'venue':
      return (
        <AdminSectionLocation data={data} />
      );
    
    case 'gallery':
      return (
        <AdminSectionGallery
          gallery={data.gallery}
          galleryItems={data.galleryImages}
          initialGalleryItems={data.galleryImages}
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
          groomEntries={data.accountEntries?.filter((entry) => entry.group_type === 'groom') || []}
          brideEntries={data.accountEntries?.filter((entry) => entry.group_type === 'bride') || []}
          accountFormOpen={accountFormOpen}
          setAccountFormOpen={setAccountFormOpen}
        />
      );
    
    case 'guestbook':
      return (
        <AdminSectionGuestbook
          guestbook={data.guestbook}
          guestbookEntries={data.guestbookEntries || []}
          sectionTitles={data.sectionTitles}
          guestbookPage={1}
          setGuestbookPage={() => {}}
        />
      );
    
    case 'rsvp':
      return (
        <AdminSectionRsvp
          rsvp={data.rsvp}
          rsvpResponses={data.rsvpResponses || []}
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
    
    case 'bgm':
      return (
        <AdminSectionBgm
          bgm={data.bgm}
        />
      );

    case 'closing':
      return <AdminSectionClosing closing={data.closing} />;
    
    default:
      return (
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              페이지를 찾을 수 없습니다
            </h2>
            <p className="text-gray-600">
              요청하신 페이지가 존재하지 않습니다.
            </p>
          </div>
        </div>
      );
  }
};
