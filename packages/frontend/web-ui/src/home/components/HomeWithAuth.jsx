import { useState } from 'react';
import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { GameList } from '../../game/components/GameList';
import { STATUS_GAME_FULFILLED, useGetGames } from '../hooks/useGetGames';
import GamesIcon from '@mui/icons-material/Games';
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';

const GAME_STATUS_NON_STARTED = 'nonStarted';
const GAME_STATUS_ACTIVE = 'active';
export const PAGE_SIZE = 3;
export const ONE_PAGE = 1;

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
      gameListNonStarted.length === PAGE_SIZE
    ) {
      setPageNumberNonStarted(pageNumberNonStarted + ONE_PAGE);
      setNumPageNonStarted(pageNumberNonStarted);
    }
  };

  const onPreviousPageNonStarted = (event) => {
    event.preventDefault();
    if (
      statusNonStarted === STATUS_GAME_FULFILLED &&
      pageNumberNonStarted > ONE_PAGE
    ) {
      setPageNumberNonStarted(pageNumberNonStarted - ONE_PAGE);
      setNumPageNonStarted(pageNumberNonStarted);
    }
  };

  const onNextPageActive = (event) => {
    event.preventDefault();
    if (
      statusActive === STATUS_GAME_FULFILLED &&
      gameListActive.length === PAGE_SIZE
    ) {
      setPageNumberActive(pageNumberActive + ONE_PAGE);
      setNumPageActive(pageNumberActive);
    }
  };

  const onPreviousPageActive = (event) => {
    event.preventDefault();
    if (statusActive === STATUS_GAME_FULFILLED && pageNumberActive > ONE_PAGE) {
      setPageNumberActive(pageNumberActive - ONE_PAGE);
      setNumPageActive(pageNumberActive);
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
              <GameList
                status={statusNonStarted}
                gameList={gameListNonStarted}
              />
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
              <GameList status={statusActive} gameList={gameListActive} />
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
