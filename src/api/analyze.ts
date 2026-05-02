import ky from 'ky';
import type { HTTPError } from 'ky';

import type {
  AnalyzeErrorBody,
  AnalyzeErrorCode,
  AnalyzeRequest,
  AnalyzeResponse,
} from '@/types/analysis';

export class ApiError extends Error {
  readonly code: AnalyzeErrorCode;
  readonly status: number;
  readonly details?: string;

  constructor(code: AnalyzeErrorCode, message: string, status: number, details?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

const FALLBACK_CODE: AnalyzeErrorCode = 'INTERNAL_ERROR';

const client = ky.create({
  timeout: 60_000,
  retry: 0,
  hooks: {
    beforeError: [
      async (error: HTTPError): Promise<HTTPError> => {
        const status = error.response.status;
        let code: AnalyzeErrorCode = FALLBACK_CODE;
        let message = error.message;
        let details: string | undefined;

        try {
          const body = (await error.response.clone().json()) as Partial<AnalyzeErrorBody>;
          if (body?.error?.code) {
            code = body.error.code;
            message = body.error.message ?? message;
            details = body.error.details;
          }
        } catch {
          // 응답 본문이 JSON이 아닌 경우 fallback 코드 유지
        }

        const apiError = new ApiError(code, message, status, details);
        return apiError as unknown as HTTPError;
      },
    ],
  },
});

export async function analyzeFace(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  return client.post('/api/analyze', { json: req }).json<AnalyzeResponse>();
}
