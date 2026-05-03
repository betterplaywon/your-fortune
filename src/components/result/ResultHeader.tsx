import { Chip, Stack, Typography } from '@mui/material';

type Props = {
  summary: string;
  observations: string[];
  keywords: string[];
};

export function ResultHeader({ summary, observations, keywords }: Props) {
  return (
    <Stack spacing={2} alignItems="center" textAlign="center">
      <Typography variant="h2" component="h1">
        분석 결과
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 560 }}>
        {summary}
      </Typography>
      {observations.length > 0 && (
        <Stack spacing={1} alignItems="center" sx={{ maxWidth: 640 }}>
          <Typography variant="caption" color="text.secondary">
            사진에서 읽은 인상
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" useFlexGap>
            {observations.map((observation) => (
              <Chip
                key={observation}
                label={observation}
                size="small"
                color="secondary"
                variant="filled"
              />
            ))}
          </Stack>
        </Stack>
      )}
      {keywords.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" useFlexGap>
          {keywords.map((keyword) => (
            <Chip key={keyword} label={`#${keyword}`} color="primary" variant="outlined" />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
