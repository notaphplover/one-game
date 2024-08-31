import { models as apiModels } from '@cornie-js/api-models';
import { Box, Grid2 } from '@mui/material';
import { useState } from 'react';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { useRedirectUnauthorized } from '../../common/hooks/useRedirectUnauthorized';
import { cornieApi } from '../../common/http/services/cornieApi';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { Either } from '../../common/models/Either';
import { NonStartedGameList } from '../components/NonStartedGameList';
import { GameStatus } from '../models/GameStatus';

const GAME_STATUS_NON_STARTED: GameStatus = 'nonStarted';
const GAMES_REFRESH_INTERVAL_MS = 10000;
const PAGE_SIZE: number = 10;

function useGetGamesV1(
  page: number,
  status: string,
): { result: Either<string, apiModels.GameArrayV1> | null } {
  const result = cornieApi.useGetGamesV1Query(
    {
      params: [
        {
          isPublic: 'true',
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

export const PublicGames = (): React.JSX.Element => {
  useRedirectUnauthorized();

  const [nonStartedPage, setNonStartedPage] = useState<number>(1);

  const { result: nonStartedGamesResult } = useGetGamesV1(
    nonStartedPage,
    GAME_STATUS_NON_STARTED,
  );

  const { result: usersV1MeResult } = useGetUserMe();

  const onNextPage = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      nonStartedGamesResult?.isRight === true &&
      nonStartedGamesResult.value.length > 0
    ) {
      setNonStartedPage(nonStartedPage + 1);
    }
  };

  const onPreviousPage = (event: React.FormEvent) => {
    event.preventDefault();

    if (nonStartedGamesResult?.isRight === true) {
      const previousPage: number = nonStartedPage - 1;
      if (previousPage > 0) {
        setNonStartedPage(previousPage);
      }
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
              gamesResult={nonStartedGamesResult}
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
