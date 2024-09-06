import { models as apiModels } from '@cornie-js/api-models';
import { Box, Grid2 } from '@mui/material';
import { useState } from 'react';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { Either } from '../../common/models/Either';
import { ActiveGameList } from '../../game/components/ActiveGameList';
import { NonStartedGameList } from '../../game/components/NonStartedGameList';
import { useGetGamesMineWithSpecsV1 } from '../../game/hooks/useGetGamesMineWithSpecsV1';
import { GameStatus } from '../../game/models/GameStatus';

const GAME_STATUS_NON_STARTED: GameStatus = 'nonStarted';
const GAME_STATUS_ACTIVE: GameStatus = 'active';
const GAMES_REFRESH_INTERVAL_MS = 10000;
const PAGE_SIZE: number = 3;
const ONE_PAGE: number = 1;

function useGetGamesV1Mine(
  page: number,
  status: string,
): { result: Either<string, apiModels.GameArrayV1> | null } {
  const result = cornieApi.useGetGamesV1MineQuery(
    {
      params: [
        {
          page: page.toString(),
          pageSize: PAGE_SIZE.toString(),
          status,
        },
      ],
    },
    {
      pollingInterval: GAMES_REFRESH_INTERVAL_MS,
    },
  );

  return { result: mapUseQueryHookResult(result) };
}

function useGetUserMe(): { result: Either<string, apiModels.UserV1> | null } {
  const useGetUsersV1MeQueryResult = cornieApi.useGetUsersV1MeQuery({
    params: [],
  });

  const result: Either<string, apiModels.UserV1> | null = mapUseQueryHookResult(
    useGetUsersV1MeQueryResult,
  );

  return { result };
}

export const HomeWithAuth = (): React.JSX.Element => {
  const [nonStartedPage, setNonStartedPage] = useState<number>(1);
  const [activePage, setActivePage] = useState<number>(1);

  const { result: nonStartedGamesResourcesListResult } =
    useGetGamesMineWithSpecsV1(
      {
        params: [
          {
            page: nonStartedPage.toString(),
            pageSize: PAGE_SIZE.toString(),
            status: GAME_STATUS_NON_STARTED,
          },
        ],
      },
      {
        pollingInterval: GAMES_REFRESH_INTERVAL_MS,
      },
    );

  const { result: activeGamesResult } = useGetGamesV1Mine(
    activePage,
    GAME_STATUS_ACTIVE,
  );

  const { result: usersV1MeResult } = useGetUserMe();

  const onNextPageNonStarted = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      nonStartedGamesResourcesListResult?.isRight === true &&
      nonStartedGamesResourcesListResult.value.length > 0
    ) {
      setNonStartedPage(nonStartedPage + ONE_PAGE);
    }
  };

  const onPreviousPageNonStarted = (event: React.FormEvent) => {
    event.preventDefault();

    const previousPage: number = nonStartedPage - ONE_PAGE;
    if (previousPage > 0) {
      setNonStartedPage(previousPage);
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

    const previousPage: number = activePage - ONE_PAGE;

    if (previousPage > 0) {
      setActivePage(previousPage);
    }
  };

  return (
    <CornieLayout id="home-page-with-auth" withFooter withNavBar>
      <Box
        component="div"
        className="page-section-container home-auth-container"
      >
        <Grid2 container>
          <Grid2 size={12}>
            <NonStartedGameList
              buttons={{
                share: true,
              }}
              gameResourcesListResult={nonStartedGamesResourcesListResult}
              pagination={{
                onNextPageButtonClick: onNextPageNonStarted,
                onPreviousPageButtonClick: onPreviousPageNonStarted,
              }}
              title="Pending Games"
              usersMeResult={usersV1MeResult}
            />
          </Grid2>
          <Grid2 size={12}>
            <ActiveGameList
              gameResourcesListResult={activeGamesResult}
              pagination={{
                onNextPageButtonClick: onNextPageActive,
                onPreviousPageButtonClick: onPreviousPageActive,
              }}
              title="Active Games"
            />
          </Grid2>
        </Grid2>
      </Box>
    </CornieLayout>
  );
};
