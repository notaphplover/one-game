import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { LogoCard } from '../../common/components/LogoCard';

export const Home = () => {
  return (
    <CornieLayout withFooter withNavBar>
      <Grid container>
        <Grid item xs={12}>
          <Box component="div" className="page-section-container">
            <LogoCard />
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Box component="div" className="home-button-container">
            <Box component="div" className="page-section-container">
              <Typography
                variant="h3"
                className="home-description-mobile"
                component="h3"
              >
                Made with ❤ and passion
              </Typography>
              <Typography
                variant="h3"
                className="home-description"
                component="h3"
              >
                Enjoy this magical card game made with ❤ and passion
              </Typography>

              <Link component={RouterLink} to="/auth/register">
                <Button
                  type="button"
                  className="home-button"
                  variant="contained"
                >
                  Join us
                </Button>
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </CornieLayout>
  );
};
