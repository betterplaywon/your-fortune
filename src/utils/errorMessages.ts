import type { AnalyzeErrorCode } from '@/types/analysis';

const MESSAGES: Record<AnalyzeErrorCode, string> = {
  INVALID_IMAGE: '이미지를 다시 확인해주세요. (jpeg/png/webp/gif, 5MB 이하)',
  RATE_LIMIT: '잠시 후 다시 시도해주세요.',
  UPSTREAM_ERROR: '분석 서버가 응답하지 않습니다. 잠시 후 다시 시도해주세요.',
  INTERNAL_ERROR: '예상치 못한 오류가 발생했습니다.',
};

const FALLBACK_MESSAGE = '예상치 못한 오류가 발생했습니다.';

export function getUserMessage(code: AnalyzeErrorCode | undefined): string {
  if (!code) return FALLBACK_MESSAGE;
  return MESSAGES[code] ?? FALLBACK_MESSAGE;
}
