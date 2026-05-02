import { AutoAwesome } from '@mui/icons-material';
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

import { CameraTab } from '@/components/capture/CameraTab';
import { ImagePreview } from '@/components/capture/ImagePreview';
import { UploadTab } from '@/components/capture/UploadTab';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { useAnalyzeFace } from '@/hooks/useAnalyzeFace';
import { getUserMessage } from '@/utils/errorMessages';
import { blobToBase64, compressImage } from '@/utils/image';

type TabValue = 'camera' | 'upload';

export function CapturePage() {
  const [tab, setTab] = useState<TabValue>('camera');
  const [selectedBlob, setSelectedBlob] = useState<Blob | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  const { mutate, isPending, error, reset } = useAnalyzeFace();

  function handleSelect(blob: Blob) {
    setClientError(null);
    setSelectedBlob(blob);
  }

  function handleClear() {
    setSelectedBlob(null);
    setClientError(null);
    reset();
  }

  async function handleAnalyze() {
    if (!selectedBlob) return;
    setClientError(null);
    try {
      const compressed = await compressImage(selectedBlob);
      const base64 = await blobToBase64(compressed.blob);
      mutate({ image: base64, mimeType: compressed.mimeType });
    } catch (err) {
      console.error('image preprocessing failed', err);
      setClientError('이미지를 처리할 수 없어요. 다른 사진을 시도해주세요.');
    }
  }

  const serverErrorMessage = error ? getUserMessage(error.code) : null;
  const errorMessage = clientError ?? serverErrorMessage;

  return (
    <>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h2" component="h1">
            사진 선택
          </Typography>
          <Typography variant="body1" color="text.secondary">
            카메라로 촬영하거나 가지고 있는 사진을 업로드해주세요.
          </Typography>
        </Stack>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tab}
            onChange={(_, value: TabValue) => {
              setTab(value);
              handleClear();
            }}
            aria-label="사진 입력 방식"
          >
            <Tab label="카메라로 촬영" value="camera" />
            <Tab label="사진 업로드" value="upload" />
          </Tabs>
        </Box>

        {selectedBlob && <ImagePreview blob={selectedBlob} />}

        {tab === 'camera' ? (
          <CameraTab
            selectedBlob={selectedBlob}
            onCapture={handleSelect}
            onClear={handleClear}
          />
        ) : (
          <UploadTab
            selectedBlob={selectedBlob}
            onSelect={handleSelect}
            onClear={handleClear}
          />
        )}

        {errorMessage && <ErrorState message={errorMessage} />}

        <Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AutoAwesome />}
            disabled={!selectedBlob || isPending}
            onClick={handleAnalyze}
          >
            내 관상 분석하기
          </Button>
        </Box>
      </Stack>

      <LoadingOverlay open={isPending} />
    </>
  );
}
