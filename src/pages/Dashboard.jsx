import { useState, useEffect, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Snackbar,
  Alert,
  Box,
  Chip,
} from '@mui/material';
import {
  TrendingUpRounded,
  TrendingDownRounded,
  AccountBalanceWalletRounded,
  EventAvailableRounded,
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext.jsx';
import {
  getTotals,
  getIncomeExpenseSplit,
  getDailySeries,
  getMonthlySeries,
} from '../utils/stats.js';
import { formatCurrency, formatLongDate } from '../utils/format.js';
import StatCard from '../components/StatCard.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import RecentTransactions from '../components/RecentTransactions.jsx';
import FinancialInsights from '../components/FinancialInsights.jsx';
import ChartCard from '../components/charts/ChartCard.jsx';
import IncomeExpensePie from '../components/charts/IncomeExpensePie.jsx';
import DailyBar from '../components/charts/DailyBar.jsx';
import MonthlySummary from '../components/charts/MonthlySummary.jsx';
import LoadingState from '../components/LoadingState.jsx';

// Dashboard: quick-add form, KPI statistics, charts, recent activity, and
// insights. Shows a skeleton on first paint for a professional load state.
export default function Dashboard() {
  const { transactions, addTransaction, loading: dataLoading } = useTransactions();
  const [booting, setBooting] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const totals = useMemo(() => getTotals(transactions), [transactions]);
  const pieData = useMemo(() => getIncomeExpenseSplit(transactions), [transactions]);
  const dailyData = useMemo(() => getDailySeries(transactions, 14), [transactions]);
  const monthlyData = useMemo(() => getMonthlySeries(transactions, 6), [transactions]);

  const handleAdd = async (data) => {
    try {
      await addTransaction(data);
      setToast({ severity: 'success', msg: 'Transaction saved.' });
    } catch (err) {
      setToast({ severity: 'error', msg: err.message || 'Could not save transaction.' });
    }
  };

  if (booting || dataLoading) return <LoadingState />;

  return (
    <Box>
      {/* Today banner */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ mb: 2.5 }}
      >
        <Chip
          icon={<EventAvailableRounded />}
          label={`Today: ${formatLongDate(new Date())}`}
          color="primary"
          variant="outlined"
        />
      </Stack>

      {/* Statistics */}
      <Grid container spacing={2.5} sx={{ mb: 1 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            label="Total Income"
            value={formatCurrency(totals.income)}
            icon={TrendingUpRounded}
            color="success.main"
            caption="All time"
            delay={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            label="Total Expenses"
            value={formatCurrency(totals.expense)}
            icon={TrendingDownRounded}
            color="error.main"
            caption="All time"
            delay={0.08}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <StatCard
            label="Current Balance"
            value={formatCurrency(totals.balance)}
            icon={AccountBalanceWalletRounded}
            color={totals.balance >= 0 ? 'primary.main' : 'error.main'}
            caption="Income minus expenses"
            delay={0.16}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0 }}>
        {/* Quick add */}
        <Grid item xs={12} md={5} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Add Transaction
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Date is set to today automatically.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <TransactionForm onSubmit={handleAdd} submitLabel="Save Transaction" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie + daily */}
        <Grid item xs={12} md={7} lg={8}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <ChartCard title="Income vs Expenses" subtitle="Share of totals" height={280}>
                <IncomeExpensePie data={pieData} />
              </ChartCard>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Financial Insights
                  </Typography>
                  <Box sx={{ mt: 1.5 }}>
                    <FinancialInsights transactions={transactions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <ChartCard title="Daily Transactions" subtitle="Last 14 days" height={300}>
                <DailyBar data={dailyData} />
              </ChartCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Monthly + recent */}
        <Grid item xs={12} md={8}>
          <ChartCard title="Monthly Summary" subtitle="Last 6 months" height={300}>
            <MonthlySummary data={monthlyData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Recent Transactions
              </Typography>
              <RecentTransactions transactions={transactions} limit={6} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert severity={toast.severity} variant="filled" onClose={() => setToast(null)}>
            {toast.msg}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
