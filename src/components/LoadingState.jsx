import { Box, Skeleton, Grid, Card, CardContent } from '@mui/material';

// Skeleton dashboard shown during the brief initial load, giving the app a
// professional, content-aware loading state rather than a blank screen.
export default function LoadingState() {
  return (
    <Box>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[0, 1, 2].map((i) => (
          <Grid key={i} item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="70%" height={44} />
                <Skeleton variant="text" width="40%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="rounded" height={260} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="rounded" height={260} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
