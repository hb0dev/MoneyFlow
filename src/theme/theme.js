import { createTheme } from '@mui/material/styles';

// Brand palette. Green is the primary accent across both themes to convey
// "money / growth", paired with a calm neutral surface set.
const BRAND_GREEN = '#16c784';
const BRAND_GREEN_DARK = '#0f9d6b';

// Builds a fully configured MUI theme for the requested mode ('dark' | 'light').
export function buildTheme(mode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: BRAND_GREEN,
        dark: BRAND_GREEN_DARK,
        contrastText: '#04150d',
      },
      success: { main: '#16c784' },
      error: { main: '#f5475c' },
      warning: { main: '#f7a440' },
      info: { main: '#4d8bf5' },
      background: isDark
        ? { default: '#0b0f14', paper: '#121821' }
        : { default: '#f4f6f9', paper: '#ffffff' },
      text: isDark
        ? { primary: '#e6edf3', secondary: '#8b97a7' }
        : { primary: '#0f1d2e', secondary: '#5b6b7f' },
      divider: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,29,46,0.08)',
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      h4: { fontWeight: 800, letterSpacing: '-0.02em' },
      h5: { fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontWeight: 700 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${
              isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,29,46,0.06)'
            }`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isDark
              ? '0 8px 24px rgba(0,0,0,0.35)'
              : '0 8px 24px rgba(15,29,46,0.06)',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 10, paddingInline: 18 } },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: { transition: 'background-color 0.3s ease' },
        },
      },
    },
  });
}
