import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useChartTheme } from './useChartTheme.js';
import { formatCurrency, formatCompactCurrency } from '../../utils/format.js';

// Grouped bar chart of daily income vs. expense. `data` items are
// { label, income, expense }.
export default function DailyBar({ data }) {
  const { axis, grid, tooltipStyle, incomeColor, expenseColor } = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
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
          cursor={{ fill: grid, opacity: 0.3 }}
          contentStyle={tooltipStyle}
          formatter={(value, name) => [formatCurrency(value), name]}
        />
        <Legend iconType="circle" />
        <Bar dataKey="income" name="Income" fill={incomeColor} radius={[6, 6, 0, 0]} maxBarSize={26} />
        <Bar dataKey="expense" name="Expense" fill={expenseColor} radius={[6, 6, 0, 0]} maxBarSize={26} />
      </BarChart>
    </ResponsiveContainer>
  );
}
