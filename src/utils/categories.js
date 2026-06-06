import {
  Restaurant,
  DirectionsCar,
  ShoppingBag,
  ReceiptLong,
  Payments,
  TrendingUp,
  Category as CategoryIcon,
} from '@mui/icons-material';

// Single source of truth for transaction categories. Each entry carries a
// stable id (stored on transactions), a label, an icon, and an accent color
// used consistently across charts, chips, and lists.
export const CATEGORIES = [
  { id: 'food', label: 'Food', icon: Restaurant, color: '#f7a440' },
  { id: 'transport', label: 'Transport', icon: DirectionsCar, color: '#4d8bf5' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#b06cf0' },
  { id: 'bills', label: 'Bills', icon: ReceiptLong, color: '#f5475c' },
  { id: 'salary', label: 'Salary', icon: Payments, color: '#16c784' },
  { id: 'investment', label: 'Investment', icon: TrendingUp, color: '#2dd4bf' },
  { id: 'other', label: 'Other', icon: CategoryIcon, color: '#8b97a7' },
];

const CATEGORY_MAP = CATEGORIES.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {});

// Resolve a category descriptor by id, always returning a valid fallback.
export function getCategory(id) {
  return CATEGORY_MAP[id] || CATEGORY_MAP.other;
}
