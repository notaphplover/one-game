import { models as apiModels } from '@cornie-js/api-models';
import { Box, Typography } from '@mui/material';

import {
  useGetFinishedGameWinner,
  UseGetFinishedGameWinnerResult,
} from '../hooks/useGetFinishedGameWinner';
import { BaseGameListItem } from './BaseGameListItem';

export interface FinishedGameListItemOptions {
  game: apiModels.GameV1;
}

function getWinner(
  game: apiModels.GameV1,
): UseGetFinishedGameWinnerResult | undefined {
  if (game.state.status === 'finished') {
    return useGetFinishedGameWinner(game);
  } else {
    return undefined;
  }
}

export const FinishedGameListItem = (options: FinishedGameListItemOptions) => {
  const nameGameWinner: string | undefined = getWinner(options.game)
    ?.finishedGameWinner?.name;

  const winnerGame = (
    <Box component="div" className="game-list-item-text">
      <Typography>{`Winner: ${nameGameWinner ?? 'unknown'}`}</Typography>
    </Box>
  );

  return <BaseGameListItem button={winnerGame} gameText={options.game.name} />;
};
