import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { buildTheme } from './theme.js';

const STORAGE_KEY = 'moneyflow:theme-mode';

const ThemeModeContext = createContext({
  mode: 'dark',
  toggleMode: () => {},
});

// Provides the active color mode plus a toggle, persisting the choice so the
// user's preference survives reloads.
export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'dark';
  });

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const theme = useMemo(() => buildTheme(mode), [mode]);
  const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

// Convenience hook for reading/toggling the theme mode anywhere in the tree.
export function useThemeMode() {
  return useContext(ThemeModeContext);
}
