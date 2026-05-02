import type { SupportedMimeType } from '@/types/analysis';

import { JPEG_QUALITY, MAX_IMAGE_DIMENSION } from './constants';

export type CompressedImage = {
  blob: Blob;
  mimeType: SupportedMimeType;
  width: number;
  height: number;
};

export async function compressImage(file: Blob): Promise<CompressedImage> {
  const bitmap = await loadBitmap(file);
  try {
    const { width, height } = fitWithin(bitmap.width, bitmap.height, MAX_IMAGE_DIMENSION);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D 컨텍스트를 사용할 수 없습니다.');
    }
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY);
    return { blob, mimeType: 'image/jpeg', width, height };
  } finally {
    bitmap.close?.();
  }
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

async function loadBitmap(blob: Blob): Promise<ImageBitmap> {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(blob);
  }
  throw new Error('이 브라우저는 이미지 디코딩을 지원하지 않습니다.');
}

function fitWithin(srcW: number, srcH: number, max: number): { width: number; height: number } {
  if (srcW <= max && srcH <= max) {
    return { width: srcW, height: srcH };
  }
  const ratio = srcW > srcH ? max / srcW : max / srcH;
  return {
    width: Math.round(srcW * ratio),
    height: Math.round(srcH * ratio),
  };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('이미지 인코딩에 실패했습니다.'));
      },
      type,
      quality,
    );
  });
}
