import { Box, Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <Stack spacing={4} alignItems="center" textAlign="center" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h1" component="h1">
          AI 관상 분석
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480 }}>
          얼굴 사진 한 장으로 전반적 인상·재물·애정·건강 네 가지 카테고리의 인상을 분석해드려요.
        </Typography>
      </Stack>

      <Stack spacing={1.5} alignItems="center">
        <Button component={Link} to="/capture" variant="contained" size="large">
          관상 보러가기
        </Button>
        <Typography variant="body2" color="text.secondary">
          재미로 즐겨주세요
        </Typography>
      </Stack>

      <Box
        sx={{
          mt: 2,
          py: 2,
          px: 3,
          maxWidth: 520,
          bgcolor: 'background.default',
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          사진은 분석 후 어떤 서버에도 저장되지 않으며, 분석이 끝나면 즉시 폐기됩니다.
        </Typography>
      </Box>
    </Stack>
  );
}
