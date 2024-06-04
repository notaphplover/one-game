import { models as apiModels } from '@cornie-js/api-models';
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';
import GamesIcon from '@mui/icons-material/Games';
import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { useState } from 'react';
import {
  NavigateFunction,
  Link as RouterLink,
  useNavigate,
} from 'react-router-dom';

import { cornieApi } from '../../common/http/services/cornieApi';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { Either } from '../../common/models/Either';
import { GameList } from '../../game/components/GameList';
import { GameStatus } from '../../game/models/GameStatus';

const GAME_STATUS_NON_STARTED: GameStatus = 'nonStarted';
const GAME_STATUS_ACTIVE: GameStatus = 'active';
const PAGE_SIZE: number = 3;
const ONE_PAGE: number = 1;

function useGetGamesV1Mine(
  page: number,
  status: string,
): { result: Either<string, apiModels.GameArrayV1> | null } {
  const { data, error, isLoading } = cornieApi.useGetGamesV1MineQuery({
    params: [
      {
        page: page.toString(),
        pageSize: PAGE_SIZE.toString(),
        status,
      },
    ],
  });

  const result: Either<string, apiModels.GameArrayV1> | null = isLoading
    ? null
    : data === undefined
      ? {
          isRight: false,
          value: error?.message ?? '',
        }
      : {
          isRight: true,
          value: data,
        };

  return { result };
}

export const HomeWithAuth = (): React.JSX.Element => {
  const [nonStartedPage, setNonStartedPage] = useState<number>(1);
  const [activePage, setActivePage] = useState<number>(1);

  const { result: nonStartedGamesResult } = useGetGamesV1Mine(
    nonStartedPage,
    GAME_STATUS_NON_STARTED,
  );

  const { result: activeGamesResult } = useGetGamesV1Mine(
    activePage,
    GAME_STATUS_ACTIVE,
  );

  const navigate: NavigateFunction = useNavigate();

  const onNextPageNonStarted = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      nonStartedGamesResult?.isRight === true &&
      nonStartedGamesResult.value.length > 0
    ) {
      setNonStartedPage(nonStartedPage + ONE_PAGE);
    }
  };

  const onPreviousPageNonStarted = (event: React.FormEvent) => {
    event.preventDefault();

    if (nonStartedGamesResult?.isRight === true) {
      const previousPage: number = nonStartedPage - ONE_PAGE;
      if (previousPage >= ONE_PAGE) {
        setNonStartedPage(previousPage);
      }
    }
  };

  const onNextPageActive = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      activeGamesResult?.isRight === true &&
      activeGamesResult.value.length > 0
    ) {
      setActivePage(activePage + ONE_PAGE);
    }
  };

  const onPreviousPageActive = (event: React.FormEvent) => {
    event.preventDefault();

    if (activeGamesResult?.isRight === true) {
      const previousPage: number = activePage - ONE_PAGE;
      if (previousPage >= ONE_PAGE) {
        setActivePage(previousPage);
      }
    }
  };

  const onCreateNewGame = (event: React.FormEvent) => {
    event.preventDefault();
    navigate('/game', { replace: true });
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
                  aria-pressed="true"
                  className="home-auth-button-new-game"
                  variant="contained"
                  startIcon={<GamesIcon />}
                  onClick={onCreateNewGame}
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
              <GameList gamesResult={nonStartedGamesResult} />
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
              <GameList gamesResult={activeGamesResult} />
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
