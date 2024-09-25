import { Home } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid2,
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

  const isPending: () => boolean = (): boolean =>
    status === JoinExistingGameStatus.pending;

  const JoinExistingGamePanel = ({
    children,
  }: {
    children: React.JSX.Element | React.JSX.Element[];
  }) => {
    return (
      <Box className="box-shadow join-existing-game-grid">
        {children}
        <Box>
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
        </Box>
      </Box>
    );
  };

  let joinExistingGamePanel: React.JSX.Element | undefined = undefined;

  switch (status) {
    case JoinExistingGameStatus.fulfilled:
      joinExistingGamePanel = (
        <JoinExistingGamePanel>
          <Box>
            <Typography variant="h5" className="join-existing-game-title">
              Game joined
            </Typography>
          </Box>
          <Box className="join-existing-game-success">
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
            </Alert>
          </Box>
        </JoinExistingGamePanel>
      );
      break;
    case JoinExistingGameStatus.rejected:
      joinExistingGamePanel = (
        <JoinExistingGamePanel>
          <Box>
            <Typography variant="h5" className="join-existing-game-title">
              Game not joined
            </Typography>
          </Box>
          <Box className="join-existing-game-error">
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
          </Box>
        </JoinExistingGamePanel>
      );
      break;
    default:
      joinExistingGamePanel = undefined;
  }

  return (
    <>
      <CircularProgressModal open={isPending()} />
      <CornieLayout>
        <Grid2
          className="join-existing-game-container"
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid2>
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
          </Grid2>

          <Grid2>{joinExistingGamePanel}</Grid2>
        </Grid2>
      </CornieLayout>
    </>
  );
};
