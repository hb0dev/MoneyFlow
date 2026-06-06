import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { useChartTheme } from './useChartTheme.js';
import { formatCurrency } from '../../utils/format.js';
import EmptyState from '../EmptyState.jsx';
import { PieChartOutlineRounded } from '@mui/icons-material';

// Donut chart comparing total income vs. total expenses, with a centered
// balance label. `data` is [{ name, value, color }].
export default function IncomeExpensePie({ data }) {
  const { tooltipStyle } = useChartTheme();
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total <= 0) {
    return (
      <EmptyState
        icon={PieChartOutlineRounded}
        title="No data to chart"
        description="Add income or expenses to see the breakdown."
      />
    );
  }

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="80%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => [formatCurrency(value), name]}
          />
          <Legend verticalAlign="bottom" height={32} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
      <Box
        sx={{
          position: 'absolute',
          top: '42%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Balance
        </Typography>
        <Typography variant="h6">
          {formatCurrency(data[0].value - data[1].value)}
        </Typography>
      </Box>
    </Box>
  );
}
