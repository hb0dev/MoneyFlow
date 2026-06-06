import { Card, CardContent, Typography, Box, Stack } from '@mui/material';

// Consistent card wrapper for charts: title, optional action slot, and a fixed
// height body so charts never collapse.
export default function ChartCard({ title, subtitle, action, height = 300, children }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 1 }}
        >
          <Box>
            <Typography variant="subtitle1">{title}</Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Stack>
        <Box sx={{ height, width: '100%' }}>{children}</Box>
      </CardContent>
    </Card>
  );
}
