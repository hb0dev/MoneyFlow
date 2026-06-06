// Currency + date formatting helpers shared across the app so number and date
// presentation stay consistent everywhere.

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Format a number as a USD currency string (e.g. 1234.5 -> "$1,234.50").
export function formatCurrency(value) {
  const amount = Number.isFinite(value) ? value : 0;
  return currencyFormatter.format(amount);
}

// Compact currency for tight spaces / axis labels (e.g. 12000 -> "$12K").
export function formatCompactCurrency(value) {
  const amount = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

// ISO date (yyyy-MM-dd) used as the canonical storage format for a day.
export function toISODate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Human-friendly long date (e.g. "Friday, June 6, 2026").
export function formatLongDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Short date for tables/lists (e.g. "Jun 6, 2026").
export function formatShortDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
