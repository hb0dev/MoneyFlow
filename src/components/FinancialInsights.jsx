import { Stack, Box, Typography, LinearProgress } from '@mui/material';
import {
  LightbulbOutlined,
  SavingsOutlined,
  CategoryOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';
import { getTotals, getCategoryBreakdown } from '../utils/stats.js';
import { formatCurrency } from '../utils/format.js';

// Derives a few plain-language insights from the data: savings rate, biggest
// spending category, and a simple status message. Pure presentation of stats.
export default function FinancialInsights({ transactions }) {
  const { income, expense, balance } = getTotals(transactions);
  const breakdown = getCategoryBreakdown(transactions, 'expense');
  const topCategory = breakdown[0];
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  const insights = [];

  if (income > 0) {
    insights.push({
      icon: SavingsOutlined,
      color: savingsRate >= 0 ? 'success.main' : 'error.main',
      title: `Savings rate: ${savingsRate}%`,
      detail:
        savingsRate >= 20
          ? 'Great job — you are saving a healthy share of your income.'
          : savingsRate >= 0
          ? 'You are saving some income. Aim for 20% or more.'
          : 'You are spending more than you earn this period.',
      progress: Math.max(0, Math.min(100, savingsRate)),
    });
  }

  if (topCategory) {
    const share = expense > 0 ? Math.round((topCategory.value / expense) * 100) : 0;
    insights.push({
      icon: CategoryOutlined,
      color: topCategory.color,
      title: `Top spending: ${topCategory.name}`,
      detail: `${formatCurrency(topCategory.value)} (${share}% of expenses)`,
      progress: share,
    });
  }

  insights.push({
    icon: balance >= 0 ? LightbulbOutlined : WarningAmberOutlined,
    color: balance >= 0 ? 'info.main' : 'warning.main',
    title: balance >= 0 ? 'Positive balance' : 'Negative balance',
    detail:
      balance >= 0
        ? `You currently have ${formatCurrency(balance)} available.`
        : `You are ${formatCurrency(Math.abs(balance))} over budget.`,
  });

  return (
    <Stack spacing={2.5}>
      {insights.map((item) => {
        const Icon = item.icon;
        return (
          <Stack key={item.title} direction="row" spacing={1.5} alignItems="flex-start">
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                color: item.color,
                bgcolor: (t) =>
                  `color-mix(in srgb, ${
                    item.color.includes('.')
                      ? t.palette[item.color.split('.')[0]][item.color.split('.')[1]]
                      : item.color
                  } 16%, transparent)`,
              }}
            >
              <Icon fontSize="small" />
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle2">{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.detail}
              </Typography>
              {typeof item.progress === 'number' && (
                <LinearProgress
                  variant="determinate"
                  value={item.progress}
                  sx={{ mt: 1, borderRadius: 4, height: 6 }}
                />
              )}
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
}
