import { Box, Button, Grid, Typography } from '@mui/material';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { ReversedCard } from '../../game/components/ReversedCard';

export const CornieHome = () => {
  return (
    <CornieLayout>
      <Grid container sx={{ margin: '0 auto', maxWidth: '1200px' }}>
        <Box component="div" className="home-title-container">
          <Typography className="home-title" component="h3">
            Welcome to Cornie
          </Typography>
        </Box>

        <Box component="div" className="home-cards-grid">
          <Box component="div" className="home-cards-grid-element rotate-left">
            <ReversedCard></ReversedCard>
          </Box>
          <Box component="div" className="home-cards-grid-element rotate-right">
            <ReversedCard></ReversedCard>
          </Box>
        </Box>

        <Box component="div" className="home-button-container">
          <Button type="button" className="home-button" variant="contained">
            <Typography>Join us!</Typography>
          </Button>
        </Box>
      </Grid>
    </CornieLayout>
  );
};
