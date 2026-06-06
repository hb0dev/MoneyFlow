import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { api, getToken, setToken } from '../api/client.js';

const AuthContext = createContext(null);

// Owns authentication state. Persists the JWT, validates it on load, and
// exposes login/logout. The rest of the app reads `user` to gate access.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, confirm it is still valid.
  useEffect(() => {
    let active = true;
    async function bootstrap() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const { user: me } = await api.get('/auth/me');
        if (active) setUser(me);
      } catch {
        setToken(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (username, password) => {
    const { token, user: me } = await api.post('/auth/login', { username, password });
    setToken(token);
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, isAuthenticated: Boolean(user) }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
