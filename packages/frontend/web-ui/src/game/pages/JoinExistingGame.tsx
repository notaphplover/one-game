import { Home } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { CircularProgressModal } from '../../common/components/CircularProgressModal';
import { getSlug } from '../../common/helpers/getSlug';
import { useRedirectUnauthorized } from '../../common/hooks/useRedirectUnauthorized';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { PageName } from '../../common/models/PageName';
import { useJoinExistingGame } from '../hooks/useJoinExistingGame';
import { JoinExistingGameStatus } from '../models/JoinExistingGameStatus';

export const JoinExistingGame = (): React.JSX.Element => {
  useRedirectUnauthorized();

  const { status, errorMessage } = useJoinExistingGame();

  const getJoinExistinGameOkDisplay = (): string => {
    return status === JoinExistingGameStatus.fulfilled ? '' : 'none';
  };

  const getJoinExistinGameErrorDisplay = (): string => {
    return status === JoinExistingGameStatus.rejected ? '' : 'none';
  };

  const isPending: () => boolean = (): boolean =>
    status === JoinExistingGameStatus.pending;

  return (
    <>
      <CircularProgressModal open={isPending()} />
      <CornieLayout>
        <Grid
          className="join-existing-game-container"
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <Box className="logo-cornie-position">
              <Typography
                className="logo-cornie-text"
                variant="h4"
                noWrap
                component="a"
                href="/"
              >
                CORNIE
              </Typography>
            </Box>
          </Grid>

          <Grid item>
            <Box className="box-shadow join-existing-game-grid">
              <Grid container>
                <Grid
                  className="join-existing-game-ok"
                  container
                  display={getJoinExistinGameOkDisplay()}
                >
                  <Grid item xs={12}>
                    <Typography
                      variant="h5"
                      className="join-existing-game-title"
                    >
                      {'Game joined'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className="join-existing-game-success">
                      <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                      </Alert>
                    </Box>
                  </Grid>
                </Grid>

                <Grid
                  className="join-existing-game-error-message"
                  container
                  display={getJoinExistinGameErrorDisplay()}
                >
                  <Grid item xs={12}>
                    <Typography
                      variant="h5"
                      className="join-existing-game-title"
                    >
                      {'Game not joined'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className="join-existing-game-error">
                      <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                      </Alert>
                    </Box>
                  </Grid>
                </Grid>

                <Grid container direction="row" justifyContent="end">
                  <Grid item xs={12}>
                    <Link
                      component={RouterLink}
                      color="primary"
                      to={getSlug(PageName.home)}
                    >
                      <Button
                        type="button"
                        className="return-cornie-button"
                        variant="contained"
                        startIcon={<Home />}
                      >
                        Cornie Home
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </CornieLayout>
    </>
  );
};
