import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useChartTheme } from './useChartTheme.js';
import { formatCurrency, formatCompactCurrency } from '../../utils/format.js';

// Monthly summary as a smooth area chart of income vs. expense over time.
export default function MonthlySummary({ data }) {
  const { axis, grid, tooltipStyle, incomeColor, expenseColor } = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={incomeColor} stopOpacity={0.35} />
            <stop offset="100%" stopColor={incomeColor} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={expenseColor} stopOpacity={0.35} />
            <stop offset="100%" stopColor={expenseColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: axis, fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fill: axis, fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCompactCurrency}
          width={64}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value, name) => [formatCurrency(value), name]}
        />
        <Legend iconType="circle" />
        <Area
          type="monotone"
          dataKey="income"
          name="Income"
          stroke={incomeColor}
          strokeWidth={2}
          fill="url(#incomeFill)"
        />
        <Area
          type="monotone"
          dataKey="expense"
          name="Expense"
          stroke={expenseColor}
          strokeWidth={2}
          fill="url(#expenseFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
