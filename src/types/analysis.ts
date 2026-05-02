export type CategoryKey = 'overall' | 'wealth' | 'love' | 'health';

export type CategoryResult = {
  title: string;
  body: string;
  advice: string;
  score: number;
};

export type AnalysisResult = {
  overallSummary: string;
  keywords: string[];
  categories: Record<CategoryKey, CategoryResult>;
};

export type AnalyzeMeta = {
  modelId: string;
  elapsedMs: number;
  cached: boolean;
};

export type AnalyzeResponse = {
  result: AnalysisResult;
  meta: AnalyzeMeta;
};

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

export type SupportedMimeType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

export type AnalyzeRequest = {
  image: string;
  mimeType: SupportedMimeType;
};
