import type { SupportedMimeType } from '@/types/analysis';

import { MIME_ALLOWLIST } from './constants';

export function isSupportedMimeType(value: string): value is SupportedMimeType {
  return (MIME_ALLOWLIST as readonly string[]).includes(value);
}

export function assertSupportedMimeType(value: string): SupportedMimeType {
  if (!isSupportedMimeType(value)) {
    throw new Error(
      `지원하지 않는 이미지 형식입니다. (${MIME_ALLOWLIST.join(', ')} 만 허용)`,
    );
  }
  return value;
}
