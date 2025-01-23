import { Box, Typography } from '@mui/material';

import { GameWithWinnerUserPair } from '../models/GameWithWinnerUserPair';
import { BaseGameListItem } from './BaseGameListItem';

export interface FinishedGameListItemOptions {
  gameWithWinnerUser: GameWithWinnerUserPair;
}

export const FinishedGameListItem = (options: FinishedGameListItemOptions) => {
  const winnerGame = (
    <Box component="div" className="game-list-item-text">
      <Typography>{`Winner: ${options.gameWithWinnerUser.winnerUser?.name ?? 'unknown'}`}</Typography>
    </Box>
  );

  return (
    <BaseGameListItem
      button={winnerGame}
      gameText={options.gameWithWinnerUser.game.name}
    />
  );
};
