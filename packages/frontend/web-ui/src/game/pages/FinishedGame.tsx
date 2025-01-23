import { Box, Grid2 } from '@mui/material';
import { useState } from 'react';

import { CornieLayout } from '../../common/layout/CornieLayout';
import { GameStatus } from '../../game/models/GameStatus';
import { FinishedGameList } from '../components/FinishedGameList';
import { useGetGamesWithWinnerPairV1 } from '../hooks/useGetGamesWithWinnerPairV1';

const GAME_STATUS_FINISHED: GameStatus = 'finished';
const GAMES_REFRESH_INTERVAL_MS = 10000;
const PAGE_SIZE: number = 10;
const ONE_PAGE: number = 1;

export const FinishedGame = (): React.JSX.Element => {
  const [finishedPage, setFinishedPage] = useState<number>(1);

  const { result: gameFinishedGamesResult } = useGetGamesWithWinnerPairV1(
    {
      params: [
        {
          page: finishedPage.toString(),
          pageSize: PAGE_SIZE.toString(),
          status: GAME_STATUS_FINISHED,
        },
      ],
    },
    {
      pollingInterval: GAMES_REFRESH_INTERVAL_MS,
    },
  );

  const onNextPageFinished = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      gameFinishedGamesResult?.isRight === true &&
      gameFinishedGamesResult.value.length > 0
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
              gameResourcesListResult={gameFinishedGamesResult}
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
