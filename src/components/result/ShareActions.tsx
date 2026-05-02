import { IosShare, Refresh } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { AnalysisResult } from '@/types/analysis';

type Props = {
  result: AnalysisResult;
};

export function ShareActions({ result }: Props) {
  const navigate = useNavigate();
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  async function handleShare() {
    try {
      await navigator.share({
        title: 'AI 관상 분석 결과',
        text: result.overallSummary,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      console.error('share failed', err);
    }
  }

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
      <Button
        variant="contained"
        startIcon={<Refresh />}
        onClick={() => navigate('/capture')}
      >
        다시하기
      </Button>
      {canShare && (
        <Button variant="outlined" startIcon={<IosShare />} onClick={handleShare}>
          결과 공유
        </Button>
      )}
    </Stack>
  );
}
