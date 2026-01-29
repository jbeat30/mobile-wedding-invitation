'use client';

import { useState, useCallback } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { ModernCard, ModernAlert } from '@/components/admin/ModernComponents';
import { ModernInput, ModernTextarea, ModernSwitch } from '@/components/admin/ModernForm';
import { ModernButton } from '@/components/admin/ModernButton';
import { ModernGalleryManager } from '@/components/admin/ModernGalleryManager';
import { 
  ImageIcon,
  SaveIcon,
  EyeIcon,
  InfoIcon,
  SettingsIcon
} from 'lucide-react';
import { updateGalleryAction, addGalleryImageAction, deleteGalleryImageAction } from '@/app/(admin)/admin/actions/assets';
import toast from 'react-hot-toast';

type GalleryImage = AdminDashboardData['galleryImages'][number];

type AdminSectionGalleryProps = {
  gallery: AdminDashboardData['gallery'];
  _initialGalleryItems?: GalleryImage[];
  galleryItems: GalleryImage[];
  setGalleryItems: (items: GalleryImage[]) => void;
  draggedImageId: string | null;
  setDraggedImageId: (id: string | null) => void;
  dragOverImageId: string | null;
  setDragOverImageId: (id: string | null) => void;
  orderSaved: boolean;
  setOrderSaved: (saved: boolean) => void;
};

/**
 * 현대적인 갤러리 섹션
 */
export const AdminSectionGallery = ({
  gallery,
  galleryItems,
  setGalleryItems,
}: AdminSectionGalleryProps) => {
  const [gallerySettings, setGallerySettings] = useState({
    title: gallery.section_title || '갤러리',
    subtitle: gallery.description || '우리의 소중한 순간들',
    enabled: true, // 현재 데이터 구조에 enabled 필드가 없음
  });

  const [saving, setSaving] = useState(false);

  // 갤러리 설정 저장
  const handleSaveSettings = useCallback(async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', gallerySettings.title);
      formData.append('subtitle', gallerySettings.subtitle);
      formData.append('enabled', gallerySettings.enabled.toString());

      await updateGalleryAction(formData);
      toast.success('갤러리 설정이 저장되었습니다.');
    } catch (error) {
      console.error('Gallery settings save error:', error);
      toast.error('설정 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }, [gallerySettings]);

  // 이미지 업로드 처리
  const handleImageUpload = useCallback(async (files: File[]): Promise<{ id: string; url: string; filename: string; size: number; uploadedAt: Date; order: number; }[]> => {
    const uploadPromises = files.map(async (file, index) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('order', (galleryItems.length + index).toString());

      try {
        await addGalleryImageAction(formData);
        
        // ModernGalleryManager 형식으로 반환
        return {
          id: `temp-${Date.now()}-${index}`,
          url: URL.createObjectURL(file),
          filename: file.name,
          size: file.size,
          uploadedAt: new Date(),
          order: galleryItems.length + index,
        };
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  }, [galleryItems.length]);

  // 이미지 삭제 처리
  const handleImageDelete = useCallback(async (id: string): Promise<void> => {
    const formData = new FormData();
    formData.append('id', id);

    try {
      await deleteGalleryImageAction(formData);
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }, []);

  // 이미지 순서 변경 처리
  const handleImageReorder = useCallback(async (_images: { id: string; url: string; filename: string; size: number; uploadedAt: Date; order: number; }[]): Promise<void> => {
    // 실제 구현에서는 순서 변경 API 호출
    // 현재는 시뮬레이션
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }, []);

  // 갤러리 이미지를 ModernGalleryManager 형식으로 변환
  const modernGalleryImages = galleryItems.map(item => ({
    id: item.id,
    url: item.src,
    filename: item.alt || `image-${item.id}`,
    size: 0, // 현재 데이터에 size 정보 없음
    uploadedAt: new Date(),
    order: item.sort_order,
  }));

  return (
    <div className="p-6 space-y-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
            <ImageIcon className="w-7 h-7 text-rose-500" />
            <span>갤러리 관리</span>
          </h1>
          <p className="text-slate-600 mt-1">
            결혼식 사진을 업로드하고 관리하세요. 드래그 앤 드롭으로 순서를 변경할 수 있습니다.
          </p>
        </div>

        <ModernButton
          variant="outline"
          icon={<EyeIcon className="w-4 h-4" />}
          onClick={() => window.open('/#gallery', '_blank')}
        >
          미리보기
        </ModernButton>
      </div>

      {/* 안내 메시지 */}
      <ModernAlert 
        type="info" 
        title="갤러리 사용 가이드"
      >
        <ul className="text-sm space-y-1 mt-2">
          <li>• 최적의 화질을 위해 가로세로 비율이 4:3 또는 16:9인 이미지를 권장합니다</li>
          <li>• 파일 크기는 3MB 이하로 업로드하면 로딩 속도가 빨라집니다</li>
          <li>• 드래그 앤 드롭으로 이미지 순서를 쉽게 변경할 수 있습니다</li>
          <li>• 모바일에서도 최적화되어 보여집니다</li>
        </ul>
      </ModernAlert>

      {/* 갤러리 설정 */}
      <ModernCard
        title="갤러리 설정"
        subtitle="갤러리 섹션의 기본 정보를 설정하세요"
        icon={<SettingsIcon className="w-5 h-5 text-white" />}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <ModernInput
            label="갤러리 제목"
            placeholder="예: 갤러리, 우리의 순간들"
            value={gallerySettings.title}
            onChange={(value) => setGallerySettings(prev => ({ ...prev, title: value }))}
            hint="갤러리 섹션에 표시될 제목입니다"
          />

          <ModernTextarea
            label="갤러리 부제목"
            placeholder="예: 우리의 소중한 순간들을 함께 나누고 싶어요"
            value={gallerySettings.subtitle}
            onChange={(value) => setGallerySettings(prev => ({ ...prev, subtitle: value }))}
            rows={2}
            maxLength={100}
            hint="갤러리에 대한 간단한 설명입니다"
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <ModernSwitch
            label="갤러리 섹션 표시"
            description="체크 해제 시 갤러리가 청첩장에서 숨겨집니다"
            checked={gallerySettings.enabled}
            onChange={(checked) => setGallerySettings(prev => ({ ...prev, enabled: checked }))}
          />

          <ModernButton
            variant="primary"
            icon={<SaveIcon className="w-4 h-4" />}
            onClick={handleSaveSettings}
            loading={saving}
          >
            설정 저장
          </ModernButton>
        </div>
      </ModernCard>

      {/* 갤러리 이미지 관리 */}
      <ModernGalleryManager
        images={modernGalleryImages}
        onImagesChange={(images) => {
          // ModernGalleryManager에서 AdminDashboardData 형식으로 변환
          const adminGalleryItems: GalleryImage[] = images.map(img => ({
            id: img.id,
            gallery_id: 'temp',
            src: img.url,
            alt: img.filename,
            thumbnail: null,
            width: null,
            height: null,
            sort_order: img.order,
          }));
          setGalleryItems(adminGalleryItems);
        }}
        onImageUpload={handleImageUpload}
        onImageDelete={handleImageDelete}
        onImageReorder={handleImageReorder}
        maxImages={30}
        acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
      />

      {/* 추가 팁 */}
      {modernGalleryImages.length === 0 && (
        <ModernCard variant="bordered">
          <div className="text-center py-8">
            <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              첫 번째 사진을 업로드해보세요!
            </h3>
            <p className="text-slate-500 mb-6">
              결혼식의 아름다운 순간들을 손님들과 공유하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <ModernButton variant="outline" size="sm">
                📱 모바일에서 업로드하기
              </ModernButton>
              <ModernButton variant="outline" size="sm">
                💡 갤러리 가이드 보기
              </ModernButton>
            </div>
          </div>
        </ModernCard>
      )}

      {/* 갤러리 통계 */}
      {modernGalleryImages.length > 0 && (
        <ModernCard
          title="갤러리 통계"
          subtitle="현재 갤러리 상태를 한눈에 확인하세요"
          icon={<InfoIcon className="w-5 h-5 text-white" />}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">{modernGalleryImages.length}</p>
              <p className="text-sm text-slate-600">총 이미지 수</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">
                {Math.round(modernGalleryImages.reduce((sum, img) => sum + img.size, 0) / (1024 * 1024))}MB
              </p>
              <p className="text-sm text-slate-600">총 용량</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">
                {modernGalleryImages.length > 0 
                  ? Math.round(modernGalleryImages.reduce((sum, img) => sum + img.size, 0) / modernGalleryImages.length / (1024 * 1024) * 10) / 10
                  : 0}MB
              </p>
              <p className="text-sm text-slate-600">평균 용량</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">
                {gallerySettings.enabled ? '✅' : '❌'}
              </p>
              <p className="text-sm text-slate-600">표시 상태</p>
            </div>
          </div>
        </ModernCard>
      )}
    </div>
  );
};