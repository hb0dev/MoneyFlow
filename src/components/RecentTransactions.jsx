import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import { getCategory } from '../utils/categories.js';
import { formatCurrency, formatShortDate } from '../utils/format.js';
import EmptyState from './EmptyState.jsx';
import { ReceiptLongRounded } from '@mui/icons-material';

// Compact list of the most recent transactions for the dashboard widget.
export default function RecentTransactions({ transactions, limit = 6 }) {
  const items = transactions.slice(0, limit);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ReceiptLongRounded}
        title="No transactions yet"
        description="Your latest activity will appear here."
      />
    );
  }

  return (
    <List disablePadding>
      {items.map((t) => {
        const cat = getCategory(t.category);
        const Icon = cat.icon;
        const isIncome = t.type === 'income';
        return (
          <ListItem key={t.id} disableGutters sx={{ py: 1 }}>
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: `color-mix(in srgb, ${cat.color} 18%, transparent)`,
                  color: cat.color,
                }}
              >
                <Icon fontSize="small" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t.note || cat.label}
              secondary={`${cat.label} • ${formatShortDate(t.date)}`}
              primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
            />
            <Box sx={{ textAlign: 'right', pl: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: isIncome ? 'success.main' : 'error.main', whiteSpace: 'nowrap' }}
              >
                {isIncome ? '+' : '-'}
                {formatCurrency(t.amount)}
              </Typography>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
}
