import { IosShare, Refresh } from '@mui/icons-material';
import { Box, Button, Snackbar, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ShareCard } from '@/components/result/ShareCard';
import { useShareImage } from '@/hooks/useShareImage';
import type { AnalysisResult } from '@/types/analysis';

type Props = {
  result: AnalysisResult;
};

const FEEDBACK: Record<string, string> = {
  shared: '공유했어요.',
  copied: '결과 텍스트를 복사하고 이미지를 저장했어요.',
  downloaded: '결과 이미지를 저장했어요.',
};

export function ShareActions({ result }: Props) {
  const navigate = useNavigate();
  const { cardRef, share, busy } = useShareImage(result);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleShare() {
    const outcome = await share();
    if (outcome.kind === 'cancelled') return;
    if (outcome.kind === 'error') {
      setFeedback(outcome.message);
      return;
    }
    setFeedback(FEEDBACK[outcome.kind] ?? null);
  }

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => navigate('/capture')}
        >
          다시하기
        </Button>
        <Button
          variant="outlined"
          startIcon={<IosShare />}
          onClick={handleShare}
          disabled={busy}
        >
          {busy ? '준비 중…' : '결과 공유'}
        </Button>
      </Stack>

      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          left: -10000,
          top: 0,
          pointerEvents: 'none',
        }}
      >
        <ShareCard ref={cardRef} result={result} />
      </Box>

      <Snackbar
        open={!!feedback}
        autoHideDuration={3000}
        onClose={() => setFeedback(null)}
        message={feedback}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
