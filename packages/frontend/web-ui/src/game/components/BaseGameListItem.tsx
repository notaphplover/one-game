import { models as apiModels } from '@cornie-js/api-models';
import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

export interface BaseGameListItemOptions {
  button: ReactNode;
  game: apiModels.GameV1;
}

export const BaseGameListItem = ({ button, game }: BaseGameListItemOptions) => {
  return (
    <Box component="div" className="game-list-item">
      <Typography className="game-list-item-text">
        {game.name === undefined ? '--' : game.name}
      </Typography>
      {button}
    </Box>
  );
};
