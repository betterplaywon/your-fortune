import { Chip, Stack, Typography } from '@mui/material';

type Props = {
  summary: string;
  keywords: string[];
};

export function ResultHeader({ summary, keywords }: Props) {
  return (
    <Stack spacing={2} alignItems="center" textAlign="center">
      <Typography variant="h2" component="h1">
        분석 결과
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 560 }}>
        {summary}
      </Typography>
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
