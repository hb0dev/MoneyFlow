import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Stack,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  MenuRounded,
  LightModeRounded,
  DarkModeRounded,
  LogoutRounded,
  PersonOutline,
} from '@mui/icons-material';
import { useThemeMode } from '../../theme/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatLongDate } from '../../utils/format.js';

const TITLES = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/reports': 'Reports',
};

// Sticky top bar: page title, today's date, theme toggle, and the signed-in
// user menu (with logout). Surfaces the nav menu button on mobile.
export default function Topbar({ onMenuClick, isDesktop }) {
  const { mode, toggleMode } = useThemeMode();
  const { user, logout } = useAuth();
  const location = useLocation();
  const title = TITLES[location.pathname] || 'MoneyFlow';

  const [anchor, setAnchor] = useState(null);
  const initial = (user?.username || '?').charAt(0).toUpperCase();

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        backdropFilter: 'blur(8px)',
        bgcolor: (t) =>
          t.palette.mode === 'dark'
            ? 'rgba(11,15,20,0.7)'
            : 'rgba(244,246,249,0.7)',
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {!isDesktop && (
          <IconButton edge="start" onClick={onMenuClick} aria-label="open navigation">
            <MenuRounded />
          </IconButton>
        )}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {formatLongDate(new Date())}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton onClick={toggleMode} aria-label="toggle theme">
              {mode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Account">
            <IconButton onClick={(e) => setAnchor(e.currentTarget)} size="small" sx={{ ml: 0.5 }}>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {initial}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={() => setAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled sx={{ opacity: '1 !important' }}>
              <ListItemIcon>
                <PersonOutline fontSize="small" />
              </ListItemIcon>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {user?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Signed in
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                setAnchor(null);
                logout();
              }}
            >
              <ListItemIcon>
                <LogoutRounded fontSize="small" />
              </ListItemIcon>
              Sign out
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
