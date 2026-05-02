import { CloudUpload, Refresh } from '@mui/icons-material';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';

import { MAX_IMAGE_BYTES, MIME_ALLOWLIST } from '@/utils/constants';

type Props = {
  selectedBlob: Blob | null;
  onSelect: (blob: Blob) => void;
  onClear: () => void;
};

const ACCEPT = MIME_ALLOWLIST.reduce<Record<string, string[]>>((acc, mime) => {
  acc[mime] = [];
  return acc;
}, {});

export function UploadTab({ selectedBlob, onSelect, onClear }: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        const code = rejections[0].errors[0]?.code;
        setErrorMessage(
          code === 'file-too-large'
            ? '파일이 너무 커요. 5MB 이하 이미지를 사용해주세요.'
            : code === 'file-invalid-type'
              ? '지원하지 않는 형식이에요. JPEG·PNG·WebP·GIF 만 가능해요.'
              : '파일을 사용할 수 없어요. 다른 이미지를 시도해주세요.',
        );
        return;
      }

      const file = accepted[0];
      if (!file) return;
      setErrorMessage(null);
      onSelect(file);
    },
    [onSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: MAX_IMAGE_BYTES,
    multiple: false,
    disabled: !!selectedBlob,
  });

  if (selectedBlob) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Button
          startIcon={<Refresh />}
          onClick={() => {
            onClear();
            setErrorMessage(null);
          }}
          variant="outlined"
        >
          다른 사진 선택
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Box
        {...getRootProps()}
        sx={{
          width: '100%',
          aspectRatio: '4 / 3',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          borderRadius: 2,
          bgcolor: isDragActive ? 'action.hover' : 'background.default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          cursor: 'pointer',
          transition: 'border-color 120ms, background-color 120ms',
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 56, color: 'text.disabled' }} />
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ px: 2 }}>
          {isDragActive ? '여기에 놓아주세요' : '클릭하거나 사진을 끌어다 놓아주세요'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          JPEG · PNG · WebP · GIF / 최대 5MB
        </Typography>
      </Box>

      {errorMessage && <Alert severity="warning">{errorMessage}</Alert>}
    </Stack>
  );
}
