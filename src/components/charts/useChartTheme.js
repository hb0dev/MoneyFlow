import { useTheme } from '@mui/material';

// Shared tooltip style + axis colors so all charts match the active theme.
export function useChartTheme() {
  const theme = useTheme();
  return {
    axis: theme.palette.text.secondary,
    grid: theme.palette.divider,
    tooltipStyle: {
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 10,
      color: theme.palette.text.primary,
      fontSize: 13,
    },
    incomeColor: theme.palette.success.main,
    expenseColor: theme.palette.error.main,
  };
}
