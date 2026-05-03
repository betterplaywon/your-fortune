import { AnalyzeError } from './_errors.js';

export type CategoryKey = 'overall' | 'wealth' | 'love' | 'health';

export type CategoryResult = {
  title: string;
  body: string;
  advice: string;
  score: number;
};

export type AnalysisResult = {
  overallSummary: string;
  observations: string[];
  keywords: string[];
  categories: Record<CategoryKey, CategoryResult>;
};

const CATEGORY_KEYS: readonly CategoryKey[] = ['overall', 'wealth', 'love', 'health'];

export function parseAnalysisResult(rawText: string): AnalysisResult {
  const json = parseJson(rawText);
  if (!isPlainObject(json)) {
    throw new AnalyzeError('UPSTREAM_ERROR', '모델 응답 형식이 올바르지 않습니다.');
  }

  const overallSummary = json.overallSummary;
  if (typeof overallSummary !== 'string' || overallSummary.length === 0) {
    throw new AnalyzeError('UPSTREAM_ERROR', '모델 응답에 요약이 없습니다.');
  }

  const observations = parseStringArray(json.observations, 'observations', { allowMissing: true });
  const keywords = parseStringArray(json.keywords, 'keywords', { allowMissing: false });

  const categoriesRaw = json.categories;
  if (!isPlainObject(categoriesRaw)) {
    throw new AnalyzeError('UPSTREAM_ERROR', '모델 응답의 카테고리가 누락되었습니다.');
  }

  const categories = {} as Record<CategoryKey, CategoryResult>;
  for (const key of CATEGORY_KEYS) {
    categories[key] = parseCategory(categoriesRaw[key], key);
  }

  return { overallSummary, observations, keywords, categories };
}

function parseStringArray(
  value: unknown,
  fieldName: string,
  { allowMissing }: { allowMissing: boolean },
): string[] {
  if (value === undefined || value === null) {
    if (allowMissing) return [];
    throw new AnalyzeError('UPSTREAM_ERROR', `모델 응답의 ${fieldName} 형식이 올바르지 않습니다.`);
  }
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new AnalyzeError('UPSTREAM_ERROR', `모델 응답의 ${fieldName} 형식이 올바르지 않습니다.`);
  }
  return value as string[];
}

function parseCategory(value: unknown, key: CategoryKey): CategoryResult {
  if (!isPlainObject(value)) {
    throw new AnalyzeError('UPSTREAM_ERROR', `카테고리 "${key}" 형식이 올바르지 않습니다.`);
  }
  const { title, body, advice, score } = value;
  if (
    typeof title !== 'string' ||
    typeof body !== 'string' ||
    typeof advice !== 'string' ||
    typeof score !== 'number' ||
    !Number.isFinite(score)
  ) {
    throw new AnalyzeError('UPSTREAM_ERROR', `카테고리 "${key}" 필드가 누락되었습니다.`);
  }
  return { title, body, advice, score: clampScore(score) };
}

function clampScore(score: number): number {
  if (score < 0) return 0;
  if (score > 100) return 100;
  return Math.round(score);
}

function parseJson(text: string): unknown {
  const trimmed = text.trim();
  const candidate = stripCodeFence(trimmed);
  try {
    return JSON.parse(candidate);
  } catch {
    throw new AnalyzeError('UPSTREAM_ERROR', '모델 응답을 JSON으로 해석할 수 없습니다.');
  }
}

function stripCodeFence(text: string): string {
  if (!text.startsWith('```')) return text;
  const withoutOpen = text.replace(/^```(?:json)?\s*/i, '');
  const lastFence = withoutOpen.lastIndexOf('```');
  return lastFence >= 0 ? withoutOpen.slice(0, lastFence).trim() : withoutOpen;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
