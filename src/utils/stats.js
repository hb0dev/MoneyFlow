import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
  format,
  subDays,
  subMonths,
} from 'date-fns';
import { getCategory } from './categories.js';

// Pure aggregation helpers. These never touch storage or React; they take the
// transactions array and return derived numbers/series for stats and charts.

// Sum income, expense, and net balance across a list of transactions.
export function getTotals(transactions) {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, balance: income - expense };
}

// Income-vs-expense breakdown shaped for a pie chart.
export function getIncomeExpenseSplit(transactions) {
  const { income, expense } = getTotals(transactions);
  return [
    { name: 'Income', value: income, color: '#16c784' },
    { name: 'Expenses', value: expense, color: '#f5475c' },
  ];
}

// Daily income/expense series for the last `days` days, oldest first.
export function getDailySeries(transactions, days = 14) {
  const today = new Date();
  const buckets = new Map();

  for (let i = days - 1; i >= 0; i -= 1) {
    const day = subDays(today, i);
    const key = format(day, 'yyyy-MM-dd');
    buckets.set(key, {
      key,
      label: format(day, 'MMM d'),
      income: 0,
      expense: 0,
    });
  }

  for (const t of transactions) {
    const bucket = buckets.get(t.date);
    if (bucket) {
      if (t.type === 'income') bucket.income += t.amount;
      else bucket.expense += t.amount;
    }
  }

  return Array.from(buckets.values());
}

// Monthly income/expense series for the last `months` months, oldest first.
export function getMonthlySeries(transactions, months = 6) {
  const today = new Date();
  const buckets = new Map();

  for (let i = months - 1; i >= 0; i -= 1) {
    const month = subMonths(today, i);
    const key = format(month, 'yyyy-MM');
    buckets.set(key, {
      key,
      label: format(month, 'MMM yyyy'),
      income: 0,
      expense: 0,
    });
  }

  for (const t of transactions) {
    const key = t.date.slice(0, 7);
    const bucket = buckets.get(key);
    if (bucket) {
      if (t.type === 'income') bucket.income += t.amount;
      else bucket.expense += t.amount;
    }
  }

  return Array.from(buckets.values());
}

// Expense breakdown by category (for category pie / insights), largest first.
export function getCategoryBreakdown(transactions, type = 'expense') {
  const totals = new Map();
  for (const t of transactions) {
    if (t.type !== type) continue;
    totals.set(t.category, (totals.get(t.category) || 0) + t.amount);
  }
  return Array.from(totals.entries())
    .map(([id, value]) => {
      const cat = getCategory(id);
      return { id, name: cat.label, value, color: cat.color };
    })
    .sort((a, b) => b.value - a.value);
}

// Filter transactions to those falling within [start, end] inclusive.
export function filterByDateRange(transactions, start, end) {
  if (!start && !end) return transactions;
  return transactions.filter((t) => {
    const d = parseISO(t.date);
    if (start && end) return isWithinInterval(d, { start, end });
    if (start) return d >= start;
    return d <= end;
  });
}

// Build the daily / weekly / monthly report figures used on the Reports page.
export function getReports(transactions) {
  const now = new Date();
  const todayKey = format(now, 'yyyy-MM-dd');

  const todayTx = transactions.filter((t) => t.date === todayKey);
  const weekTx = transactions.filter((t) =>
    isWithinInterval(parseISO(t.date), {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    })
  );
  const monthTx = transactions.filter((t) =>
    isWithinInterval(parseISO(t.date), {
      start: startOfMonth(now),
      end: endOfMonth(now),
    })
  );

  return {
    daily: { ...getTotals(todayTx), count: todayTx.length },
    weekly: { ...getTotals(weekTx), count: weekTx.length },
    monthly: { ...getTotals(monthTx), count: monthTx.length },
    overall: { ...getTotals(transactions), count: transactions.length },
  };
}
