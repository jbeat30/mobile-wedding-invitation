'use client';

import { useState, useRef, DragEvent } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ModernCard, ModernAlert } from '@/components/admin/ModernComponents';
import { 
  ImageIcon,
  PlusIcon,
  TrashIcon,
  ArrowUpDownIcon,
  EyeIcon,
  DownloadIcon,
  XIcon,
  GripVerticalIcon
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';

interface GalleryImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: Date;
  order: number;
}

interface ModernGalleryManagerProps {
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
  onImageUpload: (files: File[]) => Promise<GalleryImage[]>;
  onImageDelete: (id: string) => Promise<void>;
  onImageReorder: (images: GalleryImage[]) => Promise<void>;
  maxImages?: number;
  acceptedTypes?: string[];
  className?: string;
}

interface SortableImageProps {
  image: GalleryImage;
  onDelete: (id: string) => void;
  onPreview: (image: GalleryImage) => void;
}

/**
 * 드래그 앤 드롭 가능한 이미지 아이템
 */
const SortableImage = ({ image, onDelete, onPreview }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative bg-white rounded-lg border-2 border-slate-200 overflow-hidden transition-all duration-200',
        isDragging ? 'shadow-2xl border-rose-400 ring-2 ring-rose-400/20 z-50' : 'hover:border-slate-300 hover:shadow-md'
      )}
    >
      {/* 드래그 핸들 */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'absolute top-2 left-2 z-10 p-1.5 bg-black/50 text-white rounded-md cursor-grab active:cursor-grabbing',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
        )}
      >
        <GripVerticalIcon className="w-4 h-4" />
      </div>

      {/* 이미지 */}
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={image.url}
          alt={image.filename}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        {/* 액션 버튼들 */}
        <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onPreview(image)}
            className="p-1.5 bg-white/90 text-slate-700 rounded-md hover:bg-white transition-colors"
            title="미리보기"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = image.url;
              link.download = image.filename;
              link.click();
            }}
            className="p-1.5 bg-white/90 text-slate-700 rounded-md hover:bg-white transition-colors"
            title="다운로드"
          >
            <DownloadIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(image.id)}
            className="p-1.5 bg-red-500/90 text-white rounded-md hover:bg-red-500 transition-colors"
            title="삭제"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 이미지 정보 */}
      <div className="p-3 bg-slate-50 border-t border-slate-200">
        <p className="text-sm font-medium text-slate-900 truncate mb-1">
          {image.filename}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{(image.size / 1024 / 1024).toFixed(2)} MB</span>
          <span>#{image.order + 1}</span>
        </div>
      </div>

      {/* 드래깅 시 오버레이 */}
      {isDragging && (
        <div className="absolute inset-0 bg-rose-400/20 border-2 border-rose-400 rounded-lg" />
      )}
    </div>
  );
};

/**
 * 현대적인 갤러리 관리 컴포넌트
 */
export const ModernGalleryManager = ({
  images,
  onImagesChange,
  onImageUpload,
  onImageDelete,
  onImageReorder,
  maxImages = 20,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  className
}: ModernGalleryManagerProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 파일 업로드 처리
  const handleFileUpload = async (files: File[]) => {
    if (!files.length) return;

    // 파일 타입 검증
    const validFiles = files.filter(file => acceptedTypes.includes(file.type));
    if (validFiles.length !== files.length) {
      toast.error('지원하지 않는 파일 형식이 포함되어 있습니다.');
    }

    // 최대 개수 검증
    if (images.length + validFiles.length > maxImages) {
      toast.error(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    setUploading(true);
    try {
      const newImages = await onImageUpload(validFiles);
      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);
      toast.success(`${newImages.length}개의 이미지가 업로드되었습니다.`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // 드래그 앤 드롭 처리
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  // 이미지 순서 변경
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      const oldIndex = images.findIndex(img => img.id === active.id);
      const newIndex = images.findIndex(img => img.id === over.id);
      
      const reorderedImages = arrayMove(images, oldIndex, newIndex).map((img, index) => ({
        ...img,
        order: index
      }));
      
      onImagesChange(reorderedImages);
      
      try {
        await onImageReorder(reorderedImages);
        toast.success('이미지 순서가 변경되었습니다.');
      } catch (error) {
        console.error('Reorder error:', error);
        toast.error('순서 변경에 실패했습니다.');
        // 실패 시 원래 순서로 되돌리기
        onImagesChange(images);
      }
    }
  };

  // 이미지 삭제
  const handleImageDelete = async (id: string) => {
    if (!confirm('이미지를 삭제하시겠습니까?')) return;
    
    try {
      await onImageDelete(id);
      const updatedImages = images.filter(img => img.id !== id);
      onImagesChange(updatedImages);
      toast.success('이미지가 삭제되었습니다.');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('이미지 삭제에 실패했습니다.');
    }
  };

  return (
    <ModernCard 
      className={cn('p-6', className)}
      title="갤러리 관리"
      subtitle={`${images.length}/${maxImages}개 이미지`}
      icon={<ImageIcon className="w-5 h-5 text-white" />}
    >
      <div className="space-y-6">
        {/* 안내 메시지 */}
        <ModernAlert type="tip" title="갤러리 사용법">
          <ul className="text-sm space-y-1 mt-2">
            <li>• 드래그 앤 드롭으로 이미지를 업로드하세요</li>
            <li>• 이미지를 드래그하여 순서를 변경할 수 있습니다</li>
            <li>• 지원 형식: JPEG, PNG, WebP (최대 {maxImages}개)</li>
          </ul>
        </ModernAlert>

        {/* 업로드 영역 */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200',
            dragOver 
              ? 'border-rose-400 bg-rose-50' 
              : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50',
            uploading && 'pointer-events-none opacity-50'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(Array.from(e.target.files));
              }
            }}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className={cn(
              'mx-auto w-12 h-12 rounded-full flex items-center justify-center',
              dragOver ? 'bg-rose-200' : 'bg-slate-200'
            )}>
              {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-500" />
              ) : (
                <ImageIcon className={cn(
                  'w-6 h-6',
                  dragOver ? 'text-rose-600' : 'text-slate-500'
                )} />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {uploading ? '업로드 중...' : '이미지 업로드'}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                {dragOver 
                  ? '이미지를 여기에 놓으세요' 
                  : '이미지를 드래그하거나 클릭하여 선택하세요'
                }
              </p>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || images.length >= maxImages}
                className={cn(
                  'px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-rose-400/20',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <PlusIcon className="w-4 h-4 inline mr-2" />
                이미지 선택
              </button>
            </div>
          </div>
        </div>

        {/* 이미지 그리드 */}
        {images.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-900">
                업로드된 이미지
              </h3>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <ArrowUpDownIcon className="w-4 h-4" />
                <span>드래그하여 순서 변경</span>
              </div>
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={images.map(img => img.id)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {images.map((image) => (
                    <SortableImage
                      key={image.id}
                      image={image}
                      onDelete={handleImageDelete}
                      onPreview={setPreviewImage}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto w-12 h-12 text-slate-400 mb-4" />
            <p className="text-slate-500">아직 업로드된 이미지가 없습니다.</p>
          </div>
        )}

        {/* 이미지 미리보기 모달 */}
        {previewImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
              
              <Image
                src={previewImage.url}
                alt={previewImage.filename}
                width={800}
                height={600}
                className="w-full h-auto max-h-[90vh] object-contain"
              />
              
              <div className="p-4 bg-slate-50 border-t">
                <h3 className="font-medium text-slate-900">{previewImage.filename}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {(previewImage.size / 1024 / 1024).toFixed(2)} MB • 순서: #{previewImage.order + 1}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModernCard>
  );
};