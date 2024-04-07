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
import { GameStatus } from '../../game/models/GameStatus';
import { UseGetGamesParams } from '../hooks/useGetGames/models/UseGetGamesParams';

export const GAME_STATUS_NON_STARTED: GameStatus = 'nonStarted';
const GAME_STATUS_ACTIVE: GameStatus = 'active';
export const PAGE_SIZE: number = 3;
export const ONE_PAGE: number = 1;

interface GetGamesParams extends UseGetGamesParams {
  status: string;
  page: number;
  pageSize: number;
}

export const HomeWithAuth = (): React.JSX.Element => {
  const [paramsNonStarted, setParamsNonStarted] = useState<GetGamesParams>({
    page: 1,
    pageSize: PAGE_SIZE,
    status: GAME_STATUS_NON_STARTED,
  });
  const [paramsActive, setParamsActive] = useState<GetGamesParams>({
    page: 1,
    pageSize: PAGE_SIZE,
    status: GAME_STATUS_ACTIVE,
  });

  const { call: callNonStarted, result: resultNonStarted } = useGetGames();

  const { call: callActive, result: resultActive } = useGetGames();

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
      setParamsNonStarted({
        ...paramsNonStarted,
        page: paramsNonStarted.page + ONE_PAGE,
      });
    }
  };

  const onPreviousPageNonStarted = (event: React.FormEvent) => {
    event.preventDefault();

    if (resultNonStarted?.isRight === true) {
      const previousPage: number = paramsNonStarted.page - ONE_PAGE;
      if (previousPage >= ONE_PAGE) {
        setParamsNonStarted({
          ...paramsNonStarted,
          page: previousPage,
        });
      }
    }
  };

  const onNextPageActive = (event: React.FormEvent) => {
    event.preventDefault();

    if (resultActive?.isRight === true && resultActive.value.length > 0) {
      setParamsActive({
        ...paramsActive,
        page: paramsActive.page + ONE_PAGE,
      });
    }
  };

  const onPreviousPageActive = (event: React.FormEvent) => {
    event.preventDefault();

    if (resultActive?.isRight === true) {
      const previousPage: number = paramsActive.page - ONE_PAGE;
      if (previousPage >= ONE_PAGE) {
        setParamsActive({
          ...paramsActive,
          page: previousPage,
        });
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
