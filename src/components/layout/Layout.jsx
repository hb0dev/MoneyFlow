import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

// App shell: a permanent sidebar on desktop, a temporary drawer on mobile,
// with the topbar and routed page content beside it.
export default function Layout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        isDesktop={isDesktop}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          minWidth: 0,
        }}
      >
        <Topbar onMenuClick={() => setMobileOpen(true)} isDesktop={isDesktop} />
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            maxWidth: 1400,
            mx: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
