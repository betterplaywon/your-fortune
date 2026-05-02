import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { analyzeFace } from '@/api/analyze';
import type { ApiError } from '@/api/analyze';
import type { AnalyzeRequest, AnalyzeResponse } from '@/types/analysis';
import { ANALYSIS_QUERY_KEY, SESSION_STORAGE_PREFIX } from '@/utils/constants';
import { generateAnalysisId } from '@/utils/id';

export function useAnalyzeFace() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<AnalyzeResponse, ApiError, AnalyzeRequest>({
    mutationFn: analyzeFace,
    onSuccess: (data) => {
      const id = generateAnalysisId();

      queryClient.setQueryData([ANALYSIS_QUERY_KEY, id], data);

      try {
        sessionStorage.setItem(`${SESSION_STORAGE_PREFIX}${id}`, JSON.stringify(data));
      } catch (err) {
        console.error('sessionStorage write failed', err);
      }

      navigate('/result', { state: { id } });
    },
  });
}
