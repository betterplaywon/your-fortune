import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

type Props = {
  blob: Blob;
};

export function ImagePreview({ blob }: Props) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const next = URL.createObjectURL(blob);
    setUrl(next);
    return () => {
      URL.revokeObjectURL(next);
    };
  }, [blob]);

  if (!url) return null;

  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio: '4 / 3',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Box
        component="img"
        src={url}
        alt="선택된 사진 미리보기"
        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </Box>
  );
}
