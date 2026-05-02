import { Typography } from '@mui/material';

type Props = {
  variant?: 'inline' | 'block';
};

export function EthicsNotice({ variant = 'inline' }: Props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        textAlign: 'center',
        ...(variant === 'block' && {
          py: 2,
          px: 3,
          bgcolor: 'background.default',
          borderRadius: 2,
        }),
      }}
    >
      본 결과는 엔터테인먼트 목적의 참고용이며, 의료·채용·금융 등 어떠한 의사 결정의 근거로도 사용될 수 없습니다.
    </Typography>
  );
}
