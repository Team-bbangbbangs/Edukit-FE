import type { PresignedUrlResponse, ImageUploadData } from '@/domains/notice/types/notice';
import { api } from '@/shared/lib/api';

// presigned url을 받는 api로직
export const getPresignedUrl = async (filenames: string[]): Promise<PresignedUrlResponse> => {
  const filenamesParam = filenames.join(',');
  return api.get<PresignedUrlResponse>(
    `/api/v2/admin/notices/presigned-url?filenames=${encodeURIComponent(filenamesParam)}`,
  );
};

// S3에 파일을 업로드하는 api 로직
export const uploadToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`S3 업로드 실패: ${response.status} ${response.statusText}`);
  }
};

/**
 * 여러 이미지를 한 번에 업로드하는 함수
 * 1. 모든 파일에 대해 한 번의 API 호출로 presigned URL들을 받아옴
 * 2. 각 파일을 해당하는 presigned URL로 S3에 업로드
 */
export const uploadMultipleImagesToS3 = async (files: File[]): Promise<ImageUploadData[]> => {
  // 1. 파일 검증
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`파일 "${file.name}"의 크기가 5MB를 초과합니다.`);
    }

    const supportedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      throw new Error(
        `파일 "${file.name}"은 지원하지 않는 형식입니다. (png, jpg, jpeg, gif, webp만 지원)`,
      );
    }
  }

  // 2. 모든 파일명 추출
  const filenames = files.map((file) => file.name);

  // 3. API 호출로 모든 presigned URL 받아오기
  const response = await getPresignedUrl(filenames);
  const imageDataArray = response.images;

  // 4. 각 파일을 해당하는 presigned URL로 S3에 병렬 업로드
  const uploadPromises = files.map(async (file, index) => {
    const imageData = imageDataArray[index];
    try {
      await uploadToS3(imageData.uploadPresignedUrl, file);
      return imageData;
    } catch (error) {
      throw new Error(
        `파일 "${file.name}" 업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    }
  });

  return Promise.all(uploadPromises);
};

// 고유한 파일명을 만드는 헬퍼 함수
export const generateUniqueFilename = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}.${extension}`;
};

export const uploadMultipleImages = async (files: File[]): Promise<ImageUploadData[]> => {
  const renamedFiles = files.map((file) => {
    const uniqueFilename = generateUniqueFilename(file.name);
    return new File([file], uniqueFilename, { type: file.type });
  });

  return uploadMultipleImagesToS3(renamedFiles);
};
