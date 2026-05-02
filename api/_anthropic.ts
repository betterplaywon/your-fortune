import Anthropic from '@anthropic-ai/sdk';

import { AnalyzeError } from './_errors.js';

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (client) return client;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AnalyzeError(
      'INTERNAL_ERROR',
      '서버 설정이 올바르지 않습니다.',
      'ANTHROPIC_API_KEY missing',
    );
  }

  client = new Anthropic({ apiKey });
  return client;
}
