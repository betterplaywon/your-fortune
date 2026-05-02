import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
};

const STAGES = [
  { atMs: 0, message: '얼굴을 인식하고 있어요' },
  { atMs: 5_000, message: '관상을 분석하고 있어요' },
  { atMs: 30_000, message: '조금만 더 기다려주세요' },
] as const;

export function LoadingOverlay({ open }: Props) {
  const [message, setMessage] = useState<string>(STAGES[0].message);

  useEffect(() => {
    if (!open) {
      setMessage(STAGES[0].message);
      return;
    }

    const timers = STAGES.slice(1).map((stage) =>
      window.setTimeout(() => setMessage(stage.message), stage.atMs),
    );
    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [open]);

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        color: 'common.white',
        bgcolor: 'rgba(20, 20, 30, 0.7)',
      }}
    >
      <Stack spacing={3} alignItems="center">
        <CircularProgress color="inherit" />
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {message}
        </Typography>
      </Stack>
    </Backdrop>
  );
}
