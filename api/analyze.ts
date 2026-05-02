import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getAnthropicClient } from './_anthropic.js';
import { AnalyzeError, sendError } from './_errors.js';
import { parseAnalysisResult, type AnalysisResult } from './_schema.js';
import { SYSTEM_PROMPT } from './_systemPrompt.js';
import { getRequestByteLength, validateAnalyzeRequest } from './_validate.js';

const MODEL_ID = 'claude-opus-4-7';
const MAX_TOKENS = 1500;

export const config = { maxDuration: 60 };

type AnalyzeMeta = {
  modelId: string;
  elapsedMs: number;
  cached: boolean;
};

type AnalyzeResponse = {
  result: AnalysisResult;
  meta: AnalyzeMeta;
};

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendError(res, new AnalyzeError('INVALID_IMAGE', 'POST 메서드만 지원합니다.'));
    return;
  }

  const startedAt = Date.now();
  let mimeType = 'unknown';
  let byteLength = 0;

  try {
    const parsed = validateAnalyzeRequest(req.body);
    mimeType = parsed.mimeType;
    byteLength = getRequestByteLength(parsed.image);

    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: MODEL_ID,
      max_tokens: MAX_TOKENS,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: parsed.mimeType, data: parsed.image },
            },
            {
              type: 'text',
              text: '위 인물의 얼굴을 보고 관상을 분석해 정의된 JSON 스키마로만 응답하세요.',
            },
          ],
        },
      ],
    });

    const text = extractText(message.content);
    const result = parseAnalysisResult(text);

    const elapsedMs = Date.now() - startedAt;
    const cached = (message.usage?.cache_read_input_tokens ?? 0) > 0;

    const body: AnalyzeResponse = {
      result,
      meta: { modelId: MODEL_ID, elapsedMs, cached },
    };

    logRequest({ mimeType, byteLength, elapsedMs, code: 'OK' });
    res.status(200).json(body);
  } catch (err) {
    const mapped = mapError(err);
    const elapsedMs = Date.now() - startedAt;
    logRequest({
      mimeType,
      byteLength,
      elapsedMs,
      code: mapped.code,
      details: mapped.details,
    });
    sendError(res, mapped);
  }
}

function extractText(content: Anthropic.ContentBlock[]): string {
  const text = content.find((block) => block.type === 'text');
  if (!text || text.type !== 'text' || text.text.length === 0) {
    throw new AnalyzeError('UPSTREAM_ERROR', '모델이 응답을 반환하지 않았습니다.');
  }
  return text.text;
}

function mapError(err: unknown): AnalyzeError {
  if (err instanceof AnalyzeError) return err;

  if (err instanceof Anthropic.RateLimitError) {
    return new AnalyzeError('RATE_LIMIT', undefined, summarizeUpstream(err));
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return new AnalyzeError('UPSTREAM_ERROR', undefined, summarizeUpstream(err));
  }
  if (err instanceof Anthropic.APIError) {
    return new AnalyzeError('UPSTREAM_ERROR', undefined, summarizeUpstream(err));
  }
  return new AnalyzeError('INTERNAL_ERROR', undefined, err instanceof Error ? err.name : 'unknown');
}

function summarizeUpstream(err: InstanceType<typeof Anthropic.APIError>): string {
  const status = 'status' in err ? err.status : undefined;
  return `${err.name}${status ? ` ${status}` : ''}: ${err.message}`;
}

function logRequest(info: {
  mimeType: string;
  byteLength: number;
  elapsedMs: number;
  code: string;
  details?: string;
}): void {
  const detailsPart = info.details ? ` details="${info.details.replace(/"/g, "'")}"` : '';
  console.error(
    `[analyze] mime=${info.mimeType} bytes=${info.byteLength} ms=${info.elapsedMs} code=${info.code}${detailsPart}`,
  );
}
