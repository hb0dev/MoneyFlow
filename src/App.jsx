import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Layout from './components/layout/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Reports from './pages/Reports.jsx';
import Login from './pages/Login.jsx';
import { useAuth } from './context/AuthContext.jsx';

// Blocks access to the app until authentication has been confirmed. While the
// initial token check runs, shows a centered spinner; if unauthenticated,
// redirects to /login and remembers where the user was headed.
function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

// Top-level route table. The login route is public; everything else is gated
// behind RequireAuth and rendered inside the persistent app Layout.
export default function App() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Box>
  );
}
