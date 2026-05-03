import { Favorite, FavoriteBorder, MonetizationOn, SelfImprovement } from '@mui/icons-material';
import { Box, Stack } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { EthicsNotice } from '@/components/common/EthicsNotice';
import { CategoryCard } from '@/components/result/CategoryCard';
import { ResultHeader } from '@/components/result/ResultHeader';
import { ShareActions } from '@/components/result/ShareActions';
import type { AnalyzeResponse, CategoryKey } from '@/types/analysis';
import { ANALYSIS_QUERY_KEY, SESSION_STORAGE_PREFIX } from '@/utils/constants';

const CATEGORY_ORDER: readonly CategoryKey[] = ['overall', 'wealth', 'love', 'health'];

const CATEGORY_ICONS: Record<CategoryKey, ReactNode> = {
  overall: <FavoriteBorder fontSize="small" />,
  wealth: <MonetizationOn fontSize="small" />,
  love: <Favorite fontSize="small" />,
  health: <SelfImprovement fontSize="small" />,
};

type LocationState = { id?: string } | null;

export function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const id = (location.state as LocationState)?.id ?? null;

  useEffect(() => {
    if (id) return;
    navigate('/', { replace: true });
  }, [id, navigate]);

  useEffect(() => {
    if (!id) return;
    const cached = queryClient.getQueryData<AnalyzeResponse>([ANALYSIS_QUERY_KEY, id]);
    if (cached) return;

    try {
      const raw = sessionStorage.getItem(`${SESSION_STORAGE_PREFIX}${id}`);
      if (!raw) {
        navigate('/', { replace: true });
        return;
      }
      const parsed = JSON.parse(raw) as AnalyzeResponse;
      queryClient.setQueryData([ANALYSIS_QUERY_KEY, id], parsed);
    } catch (err) {
      console.error('sessionStorage restore failed', err);
      navigate('/', { replace: true });
    }
  }, [id, navigate, queryClient]);

  const { data } = useQuery<AnalyzeResponse>({
    queryKey: [ANALYSIS_QUERY_KEY, id],
    enabled: !!id,
  });

  const result = data?.result;
  const orderedCategories = useMemo(() => {
    if (!result) return [];
    return CATEGORY_ORDER.map((key) => ({ key, value: result.categories[key] }));
  }, [result]);

  if (!result) return null;

  return (
    <Stack spacing={4} sx={{ pb: 4 }}>
      <ResultHeader
        summary={result.overallSummary}
        observations={result.observations}
        keywords={result.keywords}
      />

      <EthicsNotice variant="block" />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
        }}
      >
        {orderedCategories.map(({ key, value }) => (
          <CategoryCard key={key} icon={CATEGORY_ICONS[key]} result={value} />
        ))}
      </Box>

      <ShareActions result={result} />

      <EthicsNotice variant="block" />
    </Stack>
  );
}
