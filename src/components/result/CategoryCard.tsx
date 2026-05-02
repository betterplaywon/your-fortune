import { Box, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

import type { CategoryResult } from '@/types/analysis';

type Props = {
  icon: ReactNode;
  result: CategoryResult;
};

export function CategoryCard({ icon, result }: Props) {
  const score = clampScore(result.score);

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                }}
              >
                {icon}
              </Box>
              <Typography variant="h3" component="h3">
                {result.title}
              </Typography>
            </Stack>
            <ScoreGauge value={score} />
          </Stack>

          <Typography variant="body1" color="text.primary">
            {result.body}
          </Typography>

          <Box sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              조언
            </Typography>
            <Typography variant="body1">{result.advice}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ScoreGauge({ value }: { value: number }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={56}
        thickness={4}
        sx={{ color: 'action.hover' }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={56}
        thickness={4}
        sx={{
          color: 'primary.main',
          position: 'absolute',
          left: 0,
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

function clampScore(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}
