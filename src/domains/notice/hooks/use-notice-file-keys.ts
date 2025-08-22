import { useState, useEffect } from 'react';

import type { UploadedImageInfo } from '@/domains/notice/types/notice';

interface UseNoticeFileKeysProps {
  existingFileKeys?: string[];
  existingContent?: string;
}

export const useNoticeFileKeys = ({
  existingFileKeys = [],
  existingContent = '',
}: UseNoticeFileKeysProps = {}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImageInfo[]>([]);

  const [existingImageMap, setExistingImageMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (existingFileKeys.length > 0 && existingContent) {
      const imageMap = new Map<string, string>();

      existingFileKeys.forEach((fileKey) => {
        const fileUrl = `https://dev-cdn.edukit.co.kr/${fileKey}`;
        if (existingContent.includes(fileUrl)) {
          imageMap.set(fileKey, fileUrl);
        }
      });

      setExistingImageMap(imageMap);
    }
  }, [existingFileKeys, existingContent]);

  const handleImageUpload = (imageInfo: UploadedImageInfo) => {
    setUploadedImages((prev) => [...prev, imageInfo]);
  };

  const extractUsedFileKeys = (htmlContent: string): string[] => {
    const usedFileKeys: string[] = [];

    uploadedImages.forEach(({ tmpFileUrl, fileKey }) => {
      if (htmlContent.includes(tmpFileUrl)) {
        usedFileKeys.push(fileKey);
      }
    });

    existingImageMap.forEach((fileUrl, fileKey) => {
      if (htmlContent.includes(fileUrl)) {
        usedFileKeys.push(fileKey);
      }
    });

    return usedFileKeys;
  };

  const convertTmpUrlsToFileUrls = (htmlContent: string): string => {
    let convertedContent = htmlContent;

    uploadedImages.forEach(({ tmpFileUrl, fileUrl }) => {
      if (convertedContent.includes(tmpFileUrl)) {
        convertedContent = convertedContent.replaceAll(tmpFileUrl, fileUrl);
      }
    });

    return convertedContent;
  };

  const resetFileKeys = () => {
    setUploadedImages([]);
    setExistingImageMap(new Map());
  };

  return {
    handleImageUpload,
    extractUsedFileKeys,
    convertTmpUrlsToFileUrls,
    resetFileKeys,

    uploadedImagesCount: uploadedImages.length,
    existingImagesCount: existingImageMap.size,
    totalImagesCount: uploadedImages.length + existingImageMap.size,
  };
};
