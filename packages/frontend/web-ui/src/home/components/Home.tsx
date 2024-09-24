import { Box, Button, Grid2, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { getSlug } from '../../common/helpers/getSlug';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { PageName } from '../../common/models/PageName';
import { ReversedCard } from '../../game/components/ReversedCard';

export const Home = (): React.JSX.Element => {
  return (
    <CornieLayout id="home-page" withFooter withNavBar>
      <Grid2 container>
        <Grid2 size={12}>
          <Box component="div" className="page-section-container">
            <Box component="div" className="home-cards-grid">
              <Box
                component="div"
                className="home-cards-grid-element card-left"
              >
                <Box component="div" className="home-card-animation-panel">
                  <ReversedCard></ReversedCard>
                </Box>
              </Box>
              <Box
                component="div"
                className="home-cards-grid-element card-middle"
              >
                <Box component="div" className="home-card-animation-panel">
                  <ReversedCard></ReversedCard>
                </Box>
              </Box>
              <Box
                component="div"
                className="home-cards-grid-element card-right"
              >
                <Box component="div" className="home-card-animation-panel">
                  <ReversedCard></ReversedCard>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid2>
      </Grid2>
      <Grid2 container>
        <Grid2 size={12}>
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

              <Link component={RouterLink} to={getSlug(PageName.register)}>
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
        </Grid2>
      </Grid2>
    </CornieLayout>
  );
};
