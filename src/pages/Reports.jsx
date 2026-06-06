import { useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Divider,
} from '@mui/material';
import {
  TodayOutlined,
  DateRangeOutlined,
  CalendarMonthOutlined,
  AssessmentOutlined,
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext.jsx';
import {
  getReports,
  getCategoryBreakdown,
  getMonthlySeries,
} from '../utils/stats.js';
import { formatCurrency } from '../utils/format.js';
import { getCategory } from '../utils/categories.js';
import ChartCard from '../components/charts/ChartCard.jsx';
import MonthlySummary from '../components/charts/MonthlySummary.jsx';
import EmptyState from '../components/EmptyState.jsx';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useChartTheme } from '../components/charts/useChartTheme.js';

// A single period report card showing income, expense, net, and count.
function ReportCard({ title, icon: Icon, data, color }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              color,
              bgcolor: `color-mix(in srgb, ${color} 16%, transparent)`,
            }}
          >
            <Icon />
          </Box>
          <Box>
            <Typography variant="subtitle1">{title}</Typography>
            <Typography variant="caption" color="text.secondary">
              {data.count} transaction{data.count === 1 ? '' : 's'}
            </Typography>
          </Box>
        </Stack>
        <Stack spacing={1}>
          <Row label="Income" value={formatCurrency(data.income)} color="success.main" />
          <Row label="Expenses" value={formatCurrency(data.expense)} color="error.main" />
          <Divider />
          <Row
            label="Net"
            value={formatCurrency(data.balance)}
            color={data.balance >= 0 ? 'primary.main' : 'error.main'}
            bold
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, color, bold }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant={bold ? 'subtitle1' : 'body2'}
        sx={{ color, fontWeight: bold ? 700 : 600 }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

// Reports page: daily / weekly / monthly figures, an overall financial
// summary, monthly trend, and an expense-by-category breakdown.
export default function Reports() {
  const { transactions } = useTransactions();
  const { tooltipStyle } = useChartTheme();

  const reports = useMemo(() => getReports(transactions), [transactions]);
  const monthly = useMemo(() => getMonthlySeries(transactions, 6), [transactions]);
  const categoryData = useMemo(
    () => getCategoryBreakdown(transactions, 'expense'),
    [transactions]
  );

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={AssessmentOutlined}
            title="No reports yet"
            description="Add some transactions to generate daily, weekly, and monthly reports."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard title="Daily Report" icon={TodayOutlined} data={reports.daily} color="#4d8bf5" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard title="Weekly Report" icon={DateRangeOutlined} data={reports.weekly} color="#b06cf0" />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <ReportCard title="Monthly Report" icon={CalendarMonthOutlined} data={reports.monthly} color="#16c784" />
        </Grid>
      </Grid>

      {/* Overall financial summary */}
      <Card sx={{ mt: 2.5 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Financial Summary
          </Typography>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <SummaryStat label="Total Income" value={formatCurrency(reports.overall.income)} color="success.main" />
            <SummaryStat label="Total Expenses" value={formatCurrency(reports.overall.expense)} color="error.main" />
            <SummaryStat
              label="Net Balance"
              value={formatCurrency(reports.overall.balance)}
              color={reports.overall.balance >= 0 ? 'primary.main' : 'error.main'}
            />
            <SummaryStat label="Transactions" value={String(reports.overall.count)} color="text.primary" />
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2.5} sx={{ mt: 0 }}>
        <Grid item xs={12} md={7}>
          <ChartCard title="Monthly Trend" subtitle="Income vs expenses, last 6 months" height={320}>
            <MonthlySummary data={monthly} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={5}>
          <ChartCard title="Spending by Category" subtitle="Expense distribution" height={320}>
            {categoryData.length === 0 ? (
              <EmptyState title="No expenses yet" description="Expense categories will appear here." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="80%"
                    paddingAngle={2}
                    stroke="none"
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value, name) => [formatCurrency(value), name]}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}

function SummaryStat({ label, value, color }) {
  return (
    <Grid item xs={6} md={3}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" sx={{ color, mt: 0.5 }}>
        {value}
      </Typography>
    </Grid>
  );
}
