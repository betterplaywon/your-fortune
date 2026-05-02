import { Alert, Button, Stack } from '@mui/material';

type Props = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({ message, onRetry, retryLabel = '다시 시도' }: Props) {
  return (
    <Stack spacing={2} alignItems="flex-start">
      <Alert severity="error" sx={{ width: '100%' }}>
        {message}
      </Alert>
      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </Stack>
  );
}
