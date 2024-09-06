import { models as apiModels } from '@cornie-js/api-models';
import { Box, Grid2 } from '@mui/material';
import { useState } from 'react';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { useRedirectUnauthorized } from '../../common/hooks/useRedirectUnauthorized';
import { cornieApi } from '../../common/http/services/cornieApi';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { Either } from '../../common/models/Either';
import { NonStartedGameList } from '../components/NonStartedGameList';
import { useGetGamesWithSpecsV1 } from '../hooks/useGetGamesWithSpecsV1';
import { GameStatus } from '../models/GameStatus';

const GAME_STATUS_NON_STARTED: GameStatus = 'nonStarted';
const GAMES_REFRESH_INTERVAL_MS = 10000;
const PAGE_SIZE: number = 10;

function useGetUserMe(): { result: Either<string, apiModels.UserV1> | null } {
  const useGetUsersV1MeQueryResult = cornieApi.useGetUsersV1MeQuery({
    params: [],
  });

  const result: Either<string, apiModels.UserV1> | null = mapUseQueryHookResult(
    useGetUsersV1MeQueryResult,
  );

  return { result };
}

export const PublicGames = (): React.JSX.Element => {
  useRedirectUnauthorized();

  const [nonStartedPage, setNonStartedPage] = useState<number>(1);

  const { result: gamesResourcesListResult } = useGetGamesWithSpecsV1(
    {
      params: [
        {
          isPublic: 'true',
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

  const { result: usersV1MeResult } = useGetUserMe();

  const onNextPage = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      gamesResourcesListResult?.isRight === true &&
      gamesResourcesListResult.value.length > 0
    ) {
      setNonStartedPage(nonStartedPage + 1);
    }
  };

  const onPreviousPage = (event: React.FormEvent) => {
    event.preventDefault();

    const previousPage: number = nonStartedPage - 1;
    if (previousPage > 0) {
      setNonStartedPage(previousPage);
    }
  };

  return (
    <CornieLayout withFooter withNavBar>
      <Box
        component="div"
        className="page-section-container public-games-page-container"
      >
        <Grid2 container>
          <Grid2 size={12}>
            <NonStartedGameList
              buttons={{
                join: true,
              }}
              gameResourcesListResult={gamesResourcesListResult}
              pagination={{
                onNextPageButtonClick: onNextPage,
                onPreviousPageButtonClick: onPreviousPage,
              }}
              title="Public Games"
              usersMeResult={usersV1MeResult}
            />
          </Grid2>
        </Grid2>
      </Box>
    </CornieLayout>
  );
};
