import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { getSlug } from '../helpers/getSlug';
import { CornieLayout } from '../layout/CornieLayout';
import { PageName } from '../models/PageName';

export const PageNotFound = (): React.JSX.Element => {
  return (
    <CornieLayout withFooter withNavBar>
      <Grid
        className="page-not-found-page-container"
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={3}>
          <Box className="box-shadow user-info-form-grid">
            <Typography variant="h5" className="user-info-form-title">
              {'Page not found'}
            </Typography>

            <Grid container>
              <Grid item xs={12}>
                <Box className="page-not-found-button-box">
                  <Link
                    component={RouterLink}
                    to={getSlug(PageName.home)}
                    data-testid="home-link"
                  >
                    <Button type="submit" variant="contained" fullWidth>
                      <Typography textAlign="center">Return home</Typography>
                    </Button>
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </CornieLayout>
  );
};
