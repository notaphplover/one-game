import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

export interface BaseGameListItemOptions {
  button: ReactNode;
  gameText?: string | undefined;
}

export const BaseGameListItem = ({
  button,
  gameText,
}: BaseGameListItemOptions) => {
  return (
    <Box component="div" className="game-list-item">
      <Typography className="game-list-item-text">
        {gameText ?? '--'}
      </Typography>
      {button}
    </Box>
  );
};
