import type { SupportedMimeType } from '@/types/analysis';

export const MIME_ALLOWLIST = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const satisfies readonly SupportedMimeType[];

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const MAX_IMAGE_DIMENSION = 1024;

export const JPEG_QUALITY = 0.85;

export const ANALYSIS_QUERY_KEY = 'analysis';

export const SESSION_STORAGE_PREFIX = 'analysis:';
