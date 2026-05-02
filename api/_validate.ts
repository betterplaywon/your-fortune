import { AnalyzeError } from './_errors';

export type SupportedMimeType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

export type AnalyzeRequest = {
  image: string;
  mimeType: SupportedMimeType;
};

const MIME_ALLOWLIST: readonly SupportedMimeType[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateAnalyzeRequest(body: unknown): AnalyzeRequest {
  if (!isPlainObject(body)) {
    throw new AnalyzeError('INVALID_IMAGE', '요청 본문이 올바르지 않습니다.');
  }

  const { image, mimeType } = body;

  if (typeof image !== 'string' || image.length === 0) {
    throw new AnalyzeError('INVALID_IMAGE', '이미지 데이터가 비어 있습니다.');
  }

  if (typeof mimeType !== 'string' || !isSupportedMimeType(mimeType)) {
    throw new AnalyzeError(
      'INVALID_IMAGE',
      `지원하지 않는 이미지 형식입니다. (${MIME_ALLOWLIST.join(', ')} 만 허용)`,
    );
  }

  const byteLength = decodeBase64Length(image);
  if (byteLength > MAX_IMAGE_BYTES) {
    throw new AnalyzeError('INVALID_IMAGE', '이미지 용량이 5MB를 초과합니다.');
  }

  return { image, mimeType };
}

export function getRequestByteLength(image: string): number {
  return decodeBase64Length(image);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSupportedMimeType(value: string): value is SupportedMimeType {
  return (MIME_ALLOWLIST as readonly string[]).includes(value);
}

function decodeBase64Length(input: string): number {
  try {
    return Buffer.from(input, 'base64').byteLength;
  } catch {
    throw new AnalyzeError('INVALID_IMAGE', '이미지 디코딩에 실패했습니다.');
  }
}
