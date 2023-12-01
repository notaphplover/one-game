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
import ArrowForwardIosOutlined from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosNewOutlined from '@mui/icons-material/ArrowBackIosNewOutlined';

const GAME_STATUS_NON_STARTED = 'nonStarted';
const GAME_STATUS_ACTIVE = 'active';
const PAGE_SIZE = 5;
const ONE = 1;

export const HomeWithAuth = () => {
  const [pageNumberNonStarted, setPageNumberNonStarted] = useState(1);
  const [pageNumberActive, setPageNumberActive] = useState(1);

  const {
    status: statusNonStarted,
    setNumPage: setNumPageNonStarted,
    gameList: gameListNonStarted,
  } = useGetGames(GAME_STATUS_NON_STARTED, pageNumberNonStarted, PAGE_SIZE);
  const {
    status: statusActive,
    setNumPage: setNumPageActive,
    gameList: gameListActive,
  } = useGetGames(GAME_STATUS_ACTIVE, pageNumberActive, PAGE_SIZE);

  const onNextPageNonStarted = (event) => {
    event.preventDefault();
    if (
      statusNonStarted === STATUS_GAME_FULFILLED &&
      gameListNonStarted.length >= PAGE_SIZE
    ) {
      setPageNumberNonStarted(pageNumberNonStarted + ONE);
      setNumPageNonStarted(pageNumberNonStarted);
    }
  };

  const onPreviousPageNonStarted = (event) => {
    event.preventDefault();
    if (
      statusNonStarted === STATUS_GAME_FULFILLED &&
      pageNumberNonStarted > ONE
    ) {
      setPageNumberNonStarted(pageNumberNonStarted - ONE);
      setNumPageNonStarted(pageNumberNonStarted);
    }
  };

  const onNextPageActive = (event) => {
    event.preventDefault();
    if (
      statusActive === STATUS_GAME_FULFILLED &&
      gameListActive.length >= PAGE_SIZE
    ) {
      setPageNumberActive(pageNumberActive + ONE);
      setNumPageActive(pageNumberNonStarted);
    }
  };

  const onPreviousPageActive = (event) => {
    event.preventDefault();
    if (statusActive === STATUS_GAME_FULFILLED && pageNumberActive > ONE) {
      setPageNumberActive(pageNumberActive - ONE);
      setNumPageActive(pageNumberNonStarted);
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
                <Button
                  type="button"
                  className="home-auth-pagination-button"
                  variant="contained"
                  startIcon={<ArrowBackIosNewOutlined />}
                  onClick={onPreviousPageNonStarted}
                ></Button>
                <Button
                  type="button"
                  className="home-auth-pagination-button"
                  variant="contained"
                  endIcon={<ArrowForwardIosOutlined />}
                  onClick={onNextPageNonStarted}
                ></Button>
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
                <Button
                  type="button"
                  className="home-auth-pagination-button"
                  variant="contained"
                  startIcon={<ArrowBackIosNewOutlined />}
                  onClick={onPreviousPageActive}
                ></Button>
                <Button
                  type="button"
                  className="home-auth-pagination-button"
                  variant="contained"
                  endIcon={<ArrowForwardIosOutlined />}
                  onClick={onNextPageActive}
                ></Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </CornieLayout>
  );
};
