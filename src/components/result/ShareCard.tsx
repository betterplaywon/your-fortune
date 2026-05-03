import { Box, Chip, Stack, Typography } from '@mui/material';
import { forwardRef } from 'react';

import type { AnalysisResult, CategoryKey } from '@/types/analysis';

const CATEGORY_ORDER: readonly CategoryKey[] = ['overall', 'wealth', 'love', 'health'];

type Props = {
  result: AnalysisResult;
};

export const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard({ result }, ref) {
  return (
    <Box
      ref={ref}
      sx={{
        width: 1080,
        p: 6,
        bgcolor: 'background.paper',
        color: 'text.primary',
        fontFamily: 'inherit',
      }}
    >
      <Stack spacing={4}>
        <Stack spacing={1.5} alignItems="center" textAlign="center">
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 4 }}>
            AI 관상 분석 결과
          </Typography>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 700 }}>
            오늘의 인상
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 880, fontSize: 22, lineHeight: 1.6 }}>
            {result.overallSummary}
          </Typography>
        </Stack>

        {result.keywords.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" useFlexGap>
            {result.keywords.map((keyword) => (
              <Chip
                key={keyword}
                label={`#${keyword}`}
                color="primary"
                variant="outlined"
                sx={{ fontSize: 18, height: 36, px: 1 }}
              />
            ))}
          </Stack>
        )}

        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {CATEGORY_ORDER.map((key) => {
            const category = result.categories[key];
            return (
              <Box
                key={key}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.default',
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 700, fontSize: 24 }}>
                    {category.title}
                  </Typography>
                  <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800 }}>
                    {clampScore(category.score)}
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: 18, lineHeight: 1.6 }}>{category.body}</Typography>
              </Box>
            );
          })}
        </Box>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 16 }}>
            본 결과는 엔터테인먼트 목적이며, 의료·채용·금융 판단의 근거가 아닙니다.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 16 }}>
            your-fortune
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
});

function clampScore(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}
