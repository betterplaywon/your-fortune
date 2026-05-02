import type { VercelResponse } from '@vercel/node';

export type AnalyzeErrorCode =
  | 'INVALID_IMAGE'
  | 'UPSTREAM_ERROR'
  | 'RATE_LIMIT'
  | 'INTERNAL_ERROR';

export type AnalyzeErrorBody = {
  error: {
    code: AnalyzeErrorCode;
    message: string;
    details?: string;
  };
};

const STATUS: Record<AnalyzeErrorCode, number> = {
  INVALID_IMAGE: 400,
  RATE_LIMIT: 429,
  UPSTREAM_ERROR: 502,
  INTERNAL_ERROR: 500,
};

const DEFAULT_MESSAGES: Record<AnalyzeErrorCode, string> = {
  INVALID_IMAGE: '이미지를 다시 확인해주세요.',
  RATE_LIMIT: '잠시 후 다시 시도해주세요.',
  UPSTREAM_ERROR: '분석 서버가 응답하지 않습니다.',
  INTERNAL_ERROR: '예상치 못한 오류가 발생했습니다.',
};

export class AnalyzeError extends Error {
  readonly code: AnalyzeErrorCode;
  readonly details?: string;

  constructor(code: AnalyzeErrorCode, message?: string, details?: string) {
    super(message ?? DEFAULT_MESSAGES[code]);
    this.name = 'AnalyzeError';
    this.code = code;
    this.details = details;
  }
}

export function sendError(res: VercelResponse, err: AnalyzeError): void {
  const body: AnalyzeErrorBody = {
    error: {
      code: err.code,
      message: err.message,
    },
  };
  res.status(STATUS[err.code]).json(body);
}
