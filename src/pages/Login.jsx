import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import {
  AccountBalanceWalletRounded,
  PersonOutline,
  LockOutlined,
  Visibility,
  VisibilityOff,
  LoginRounded,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

// Login screen. Single-user app, so there is no registration — just sign in.
export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  // Already signed in? Skip the form.
  if (isAuthenticated) return <Navigate to={from} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: 2,
        background: (t) =>
          t.palette.mode === 'dark'
            ? 'radial-gradient(1200px 600px at 50% -10%, rgba(22,199,132,0.18), transparent), #0b0f14'
            : 'radial-gradient(1200px 600px at 50% -10%, rgba(22,199,132,0.18), transparent), #f4f6f9',
      }}
    >
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        sx={{ width: '100%', maxWidth: 420 }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, #16c784, #0f9d6b)',
                color: '#04150d',
              }}
            >
              <AccountBalanceWalletRounded fontSize="large" />
            </Box>
            <Typography variant="h5">Welcome to MoneyFlow</Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your finances.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                autoFocus
                autoComplete="username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                startIcon={<LoginRounded />}
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
