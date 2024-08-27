import { models as apiModels } from '@cornie-js/api-models';
import { Box, Grid } from '@mui/material';
import { useState } from 'react';

import { cornieApi } from '../../common/http/services/cornieApi';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { Either } from '../../common/models/Either';
import { ActiveGameList } from '../../game/components/ActiveGameList';
import { NonStartedGameList } from '../../game/components/NonStartedGameList';
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

  return (
    <CornieLayout id="home-page-with-auth" withFooter withNavBar>
      <Box
        component="div"
        className="page-section-container home-auth-container"
      >
        <Grid container>
          <Grid item xs={12}>
            <NonStartedGameList
              gamesResult={nonStartedGamesResult}
              pagination={{
                onNextPageButtonClick: onNextPageNonStarted,
                onPreviousPageButtonClick: onPreviousPageNonStarted,
              }}
              title="Pending Games"
            />
          </Grid>
          <Grid item xs={12}>
            <ActiveGameList
              gamesResult={activeGamesResult}
              pagination={{
                onNextPageButtonClick: onNextPageActive,
                onPreviousPageButtonClick: onPreviousPageActive,
              }}
              title="Active Games"
            />
          </Grid>
        </Grid>
      </Box>
    </CornieLayout>
  );
};
