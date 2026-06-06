import { Card, CardContent, Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';

// A compact KPI card used in the statistics section: icon, label, value, and
// an optional trend hint. Animates in for a polished entrance.
export default function StatCard({
  label,
  value,
  icon: Icon,
  color = 'primary.main',
  caption,
  delay = 0,
}) {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      sx={{ height: '100%' }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {label}
            </Typography>
            <Typography variant="h4" sx={{ wordBreak: 'break-word' }}>
              {value}
            </Typography>
            {caption && (
              <Typography variant="caption" color="text.secondary">
                {caption}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              bgcolor: (t) =>
                `color-mix(in srgb, ${resolveColor(color, t)} 16%, transparent)`,
              color,
              flexShrink: 0,
            }}
          >
            {Icon && <Icon />}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Resolve a palette token (e.g. "primary.main") to an actual color, falling
// back to the raw string for direct hex values.
function resolveColor(color, theme) {
  if (typeof color === 'string' && color.includes('.')) {
    const [group, shade] = color.split('.');
    return theme.palette[group]?.[shade] || color;
  }
  return color;
}
