import {
  Box,
  Button,
  Grid,
  Link,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { PendingGame } from '../../game/components/PendingGame';
import { STATUS_GAME_FULFILLED, useGetGames } from '../hooks/useGetGames';
import { ActiveGame } from '../../game/components/ActiveGame';
import GamesIcon from '@mui/icons-material/Games';
import { useEffect, useState } from 'react';

const GAME_STATUS_NON_STARTED = 'nonStarted';
const GAME_STATUS_ACTIVE = 'active';
const pageSize = 3;

export const HomeWithAuth = () => {
  const [pageNumberNonStarted, setPageNumberNonStarted] = useState(1);
  const [pageNumberActive, setPageNumberActive] = useState(1);

  const {
    status: statusNonStarted,
    setNumPage: setNumPageNonStarted,
    gameList: gameListNonStarted,
    numPage: numPageNonStarted,
  } = useGetGames(GAME_STATUS_NON_STARTED, pageNumberNonStarted, pageSize);
  const {
    status: statusActive,
    setNumPage: setNumPageActive,
    gameList: gameListActive,
    numPage: numPageActive,
  } = useGetGames(GAME_STATUS_ACTIVE, pageNumberActive, pageSize);

  useEffect(() => {
    setPageNumberNonStarted(numPageNonStarted);
  }, [numPageNonStarted]);

  useEffect(() => {
    setPageNumberActive(numPageActive);
  }, [numPageActive]);

  const onNextPageNonStarted = (_, page) => {
    if (statusNonStarted === STATUS_GAME_FULFILLED) {
      setNumPageNonStarted(page);
    }
  };

  const onNextPageActive = (_, page) => {
    if (statusActive === STATUS_GAME_FULFILLED) {
      setNumPageActive(page);
    }
  };

  return (
    <CornieLayout id="home-page-with-auth" withFooter withNavBar>
      <Box
        component="div"
        className="page-section-container home-auth-container"
      >
        <Grid container>
          <Grid item xs={12}>
            <Box component="div" className="home-auth-button-container">
              <Link component={RouterLink} to="/">
                <Button
                  type="button"
                  className="home-auth-button-new-game"
                  variant="contained"
                  startIcon={<GamesIcon />}
                >
                  New Game
                </Button>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3" className="home-auth-text" component="h3">
              Pending Games
            </Typography>
            <Box component="div" className="home-auth-container-games">
              {statusNonStarted === STATUS_GAME_FULFILLED &&
              gameListNonStarted.length > 0 ? (
                gameListNonStarted.map((game) => (
                  <PendingGame key={game.id} game={game} />
                ))
              ) : (
                <Typography
                  variant="h5"
                  className="home-auth-text-white"
                  component="h5"
                >
                  No pending games found.
                </Typography>
              )}
              <Box component="div" className="home-auth-pagination">
                <Stack className="home-auth-pagination-stack">
                  <Pagination
                    className="home-auth-pagination-item"
                    count={5}
                    color="secondary"
                    shape="rounded"
                    onChange={onNextPageNonStarted}
                  />
                </Stack>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3" className="home-auth-text" component="h3">
              Active Games
            </Typography>
            <Box component="div" className="home-auth-container-games">
              {statusActive === STATUS_GAME_FULFILLED &&
              gameListActive.length > 0 ? (
                gameListActive.map((game) => (
                  <ActiveGame key={game.id} game={game} />
                ))
              ) : (
                <Typography
                  variant="h5"
                  className="home-auth-text-white"
                  component="h5"
                >
                  No active games found.
                </Typography>
              )}
              <Box component="div" className="home-auth-pagination">
                <Stack className="home-auth-pagination-stack">
                  <Pagination
                    className="home-auth-pagination-item"
                    count={5}
                    color="secondary"
                    shape="rounded"
                    onChange={onNextPageActive}
                  />
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </CornieLayout>
  );
};
