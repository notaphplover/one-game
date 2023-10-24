import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { LogoCard } from '../../common/components/LogoCard';

export const HomeWithAuth = () => {
  return (
    <CornieLayout withFooter withNavBar>
      <Grid container className="page-section-container">
        <Grid item xs={12}>
          <LogoCard />
        </Grid>
        {/* <Grid container>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <Box component="div" className="home-button-container">
              <Box component="div" className="page-section-container">
                <Typography
                  variant="h3"
                  className="home-description-mobile"
                  component="h3"
                ></Typography>
                <Typography
                  variant="h3"
                  className="home-description"
                  component="h3"
                >
                  with token
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
        </Grid>*/}
      </Grid>
    </CornieLayout>
  );
};
