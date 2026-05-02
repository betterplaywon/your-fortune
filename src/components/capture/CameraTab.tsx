import { CameraAlt, Refresh, Videocam } from '@mui/icons-material';
import { Alert, Box, Button, Stack } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

type Props = {
  selectedBlob: Blob | null;
  onCapture: (blob: Blob) => void;
  onClear: () => void;
};

const VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  facingMode: 'user',
  width: { ideal: 1280 },
  height: { ideal: 960 },
};

export function CameraTab({ selectedBlob, onCapture, onClear }: Props) {
  const webcamRef = useRef<Webcam | null>(null);
  const [ready, setReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUserMediaError = useCallback((err: string | DOMException) => {
    console.error('camera start failed', err);
    const isPermission =
      err instanceof DOMException &&
      (err.name === 'NotAllowedError' || err.name === 'SecurityError');
    setReady(false);
    setErrorMessage(
      isPermission
        ? '카메라 권한이 거부되었어요. 브라우저 설정에서 허용하거나 사진 업로드를 이용해주세요.'
        : '카메라를 시작할 수 없어요. 사진 업로드 탭을 이용해주세요.',
    );
  }, []);

  const handleUserMedia = useCallback(() => {
    setReady(true);
    setErrorMessage(null);
  }, []);

  async function takeSnapshot() {
    const dataUrl = webcamRef.current?.getScreenshot();
    if (!dataUrl) return;

    const blob = await dataUrlToBlob(dataUrl);
    onCapture(blob);
  }

  if (selectedBlob) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Button startIcon={<Refresh />} onClick={onClear} variant="outlined">
          다시 찍기
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 3',
          bgcolor: 'background.default',
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored
          screenshotFormat="image/jpeg"
          screenshotQuality={0.92}
          videoConstraints={VIDEO_CONSTRAINTS}
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {!ready && !errorMessage && (
          <Videocam
            sx={{
              fontSize: 64,
              color: 'text.disabled',
              position: 'absolute',
            }}
          />
        )}
      </Box>

      {errorMessage && <Alert severity="warning">{errorMessage}</Alert>}

      <Stack direction="row" spacing={1.5}>
        <Button
          variant="contained"
          startIcon={<CameraAlt />}
          onClick={takeSnapshot}
          disabled={!ready}
        >
          촬영
        </Button>
      </Stack>
    </Stack>
  );
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}
