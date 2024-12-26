import { models as apiModels } from '@cornie-js/api-models';
import { Box, Grid2 } from '@mui/material';
import { useState } from 'react';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { Either } from '../../common/models/Either';
import { GameStatus } from '../../game/models/GameStatus';
import { FinishedGameList } from '../components/FinishedGameList';

const GAME_STATUS_FINISHED: GameStatus = 'finished';
const GAMES_REFRESH_INTERVAL_MS = 10000;
const PAGE_SIZE: number = 10;
const ONE_PAGE: number = 1;

function useGetGamesV1Mine(
  page: number,
  status: string,
): {
  result: Either<string, apiModels.GameArrayV1> | null;
} {
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

export const FinishedGame = (): React.JSX.Element => {
  const [finishedPage, setFinishedPage] = useState<number>(1);

  const { result: finishedGamesResult } = useGetGamesV1Mine(
    finishedPage,
    GAME_STATUS_FINISHED,
  );

  const onNextPageFinished = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      finishedGamesResult?.isRight === true &&
      finishedGamesResult.value.length > 0
    ) {
      setFinishedPage(finishedPage + ONE_PAGE);
    }
  };

  const onPreviousPageFinished = (event: React.FormEvent) => {
    event.preventDefault();

    const previousPage: number = finishedPage - ONE_PAGE;
    if (previousPage > 0) {
      setFinishedPage(previousPage);
    }
  };

  return (
    <CornieLayout id="finished-games-page" withFooter withNavBar>
      <Box
        component="div"
        className="page-section-container finished-games-page-container"
      >
        <Grid2 container>
          <Grid2 size={12}>
            <FinishedGameList
              gameResourcesListResult={finishedGamesResult}
              pagination={{
                onNextPageButtonClick: onNextPageFinished,
                onPreviousPageButtonClick: onPreviousPageFinished,
              }}
              title="Finished Games"
            />
          </Grid2>
        </Grid2>
      </Box>
    </CornieLayout>
  );
};
