import { Box, Typography, Button, Stack } from '@mui/material';
import { InboxRounded } from '@mui/icons-material';

// Friendly placeholder shown wherever there is no data yet. Optionally renders
// a call-to-action button.
export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Add your first transaction to get started.',
  icon: Icon = InboxRounded,
  actionLabel,
  onAction,
}) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.5}
      sx={{ py: 8, px: 3, textAlign: 'center' }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'action.hover',
          color: 'text.secondary',
        }}
      >
        <Icon sx={{ fontSize: 36 }} />
      </Box>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
          {actionLabel}
        </Button>
      )}
    </Stack>
  );
}
