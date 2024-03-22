import { useEffect, useState } from 'react';
import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { GameList } from '../../game/components/GameList';
import { useGetGames } from '../hooks/useGetGames';
import GamesIcon from '@mui/icons-material/Games';
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';
import {
  GameState,
  UseGetGamesParams,
  UseGetGamesResult,
} from '../models/UseGetGamesResult';

export const GAME_STATUS_NON_STARTED: GameState = 'nonStarted';
const GAME_STATUS_ACTIVE: GameState = 'active';
export const PAGE_SIZE: number = 3;
export const ONE_PAGE: number = 1;

export const HomeWithAuth = (): React.JSX.Element => {
  const [paramsNonStarted, setParamsNonStarted] = useState<UseGetGamesParams>({
    pageNumber: 1,
    status: GAME_STATUS_NON_STARTED,
  });
  const [paramsActive, setParamsActive] = useState<UseGetGamesParams>({
    pageNumber: 1,
    status: GAME_STATUS_ACTIVE,
  });

  const { call: callNonStarted, result: resultNonStarted }: UseGetGamesResult =
    useGetGames(PAGE_SIZE);

  const { call: callActive, result: resultActive }: UseGetGamesResult =
    useGetGames(PAGE_SIZE);

  let newParamsNonStarted: UseGetGamesParams = {
    pageNumber: 1,
    status: GAME_STATUS_NON_STARTED,
  };

  let newParamsActive: UseGetGamesParams = {
    pageNumber: 1,
    status: GAME_STATUS_ACTIVE,
  };

  useEffect(() => {
    callNonStarted(paramsNonStarted);
  }, [paramsNonStarted]);

  useEffect(() => {
    callActive(paramsActive);
  }, [paramsActive]);

  const onNextPageNonStarted = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      resultNonStarted?.isRight === true &&
      resultNonStarted.value.length > 0
    ) {
      const nextPage: number = paramsNonStarted.pageNumber + ONE_PAGE;
      newParamsNonStarted.pageNumber = nextPage;
      setParamsNonStarted(newParamsNonStarted);
    }
  };

  const onPreviousPageNonStarted = (event: React.FormEvent) => {
    event.preventDefault();

    if (resultNonStarted?.isRight === true) {
      const prevPage: number = paramsNonStarted.pageNumber - ONE_PAGE;
      if (prevPage >= ONE_PAGE) {
        newParamsNonStarted.pageNumber = prevPage;
        setParamsNonStarted(newParamsNonStarted);
      }
    }
  };

  const onNextPageActive = (event: React.FormEvent) => {
    event.preventDefault();

    if (resultActive?.isRight === true && resultActive.value.length > 0) {
      const nextPage: number = paramsActive.pageNumber + ONE_PAGE;
      newParamsActive.pageNumber = nextPage;
      setParamsActive(newParamsActive);
    }
  };

  const onPreviousPageActive = (event: React.FormEvent) => {
    event.preventDefault();

    if (resultActive?.isRight === true) {
      const prevPage: number = paramsActive.pageNumber - ONE_PAGE;
      if (prevPage >= ONE_PAGE) {
        newParamsActive.pageNumber = prevPage;
        setParamsActive(newParamsActive);
      }
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
              <Link component={RouterLink} to="/game/">
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
              <GameList gamesResult={resultNonStarted} />
              <Box component="div" className="home-auth-pagination">
                <Button
                  type="button"
                  className="home-auth-pagination-button arrowback-nonstarted"
                  variant="contained"
                  startIcon={<ArrowBackIosNewOutlined />}
                  onClick={onPreviousPageNonStarted}
                ></Button>
                <Button
                  type="button"
                  className="home-auth-pagination-button arrowforward-nonstarted"
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
              <GameList gamesResult={resultActive} />
              <Box component="div" className="home-auth-pagination">
                <Button
                  type="button"
                  className="home-auth-pagination-button arrowback-active"
                  variant="contained"
                  startIcon={<ArrowBackIosNewOutlined />}
                  onClick={onPreviousPageActive}
                ></Button>
                <Button
                  type="button"
                  className="home-auth-pagination-button arrowforward-active"
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
