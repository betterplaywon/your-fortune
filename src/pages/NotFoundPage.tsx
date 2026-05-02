import { Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Stack spacing={2} alignItems="center" textAlign="center" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1">
        페이지를 찾을 수 없습니다
      </Typography>
      <Button component={Link} to="/" variant="outlined">
        홈으로
      </Button>
    </Stack>
  );
}
