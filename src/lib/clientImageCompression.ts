/**
 * 브라우저에서 이미지 압축
 * @param file 원본 이미지 파일
 * @param maxBytes 목표 최대 크기 (bytes)
 * @returns 압축된 File 객체
 */
export const compressImageInBrowser = async (
  file: File,
  maxBytes: number
): Promise<{ file: File; changed: boolean }> => {
  if (!file.type.startsWith('image/')) {
    return { file, changed: false };
  }

  // 이미 목표 크기 이하면 그대로 반환
  if (file.size <= maxBytes) {
    return { file, changed: false };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(url);

      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas context not available');
        }

        // 원본 MIME 타입 그대로 유지
        const mimeType = file.type;

        // 품질과 스케일 단계
        const qualitySteps = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2];
        const scaleSteps = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4];

        let bestBlob: Blob | null = null;
        let bestSize = Infinity;

        // 다양한 스케일과 품질 조합 시도
        for (const scale of scaleSteps) {
          const width = Math.round(img.width * scale);
          const height = Math.round(img.height * scale);

          canvas.width = width;
          canvas.height = height;

          // 이미지 그리기
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          for (const quality of qualitySteps) {
            const blob = await new Promise<Blob | null>((res) => {
              canvas.toBlob((blob) => res(blob), mimeType, quality);
            });

            if (blob && blob.size < bestSize) {
              bestSize = blob.size;
              bestBlob = blob;

              // 목표 크기 달성 - 원본 파일명 유지
              if (blob.size <= maxBytes) {
                const compressedFile = new File([blob], file.name, {
                  type: mimeType,
                });
                resolve({ file: compressedFile, changed: true });
                return;
              }
            }
          }
        }

        // 최선의 결과 반환 (목표 크기 미달성이라도) - 원본 파일명 유지
        if (bestBlob) {
          const compressedFile = new File([bestBlob], file.name, {
            type: mimeType,
          });
          resolve({ file: compressedFile, changed: true });
        } else {
          throw new Error('Failed to compress image');
        }
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};
