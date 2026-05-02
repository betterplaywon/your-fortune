import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

import { EthicsNotice } from '@/components/common/EthicsNotice';

export function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            variant="h3"
            sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 700 }}
          >
            your-fortune
          </Typography>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="md" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ py: 3, px: 2, borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="md">
          <EthicsNotice />
        </Container>
      </Box>
    </Box>
  );
}
