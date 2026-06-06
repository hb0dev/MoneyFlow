import { NavLink, useLocation } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Stack,
} from '@mui/material';
import {
  SpaceDashboardOutlined,
  ReceiptLongOutlined,
  AssessmentOutlined,
  AccountBalanceWalletRounded,
} from '@mui/icons-material';

export const SIDEBAR_WIDTH = 256;

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/', icon: SpaceDashboardOutlined },
  { label: 'Transactions', to: '/transactions', icon: ReceiptLongOutlined },
  { label: 'Reports', to: '/reports', icon: AssessmentOutlined },
];

// Navigation rail content, shared by both the permanent (desktop) and
// temporary (mobile) drawer variants.
function SidebarContent({ onNavigate }) {
  const location = useLocation();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 1, py: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(135deg, #16c784, #0f9d6b)',
            color: '#04150d',
          }}
        >
          <AccountBalanceWalletRounded />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ lineHeight: 1 }}>
            MoneyFlow
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Personal finance
          </Typography>
        </Box>
      </Stack>

      <List sx={{ mt: 1, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);
          return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              onClick={onNavigate}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: active ? 'primary.main' : 'text.secondary',
                bgcolor: active ? 'action.selected' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: active ? 700 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

// Responsive sidebar: permanent drawer on desktop, swipeable temporary drawer
// on mobile/tablet.
export default function Sidebar({ isDesktop, mobileOpen, onClose }) {
  if (isDesktop) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            borderRight: (t) => `1px solid ${t.palette.divider}`,
          },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box' } }}
    >
      <SidebarContent onNavigate={onClose} />
    </Drawer>
  );
}
