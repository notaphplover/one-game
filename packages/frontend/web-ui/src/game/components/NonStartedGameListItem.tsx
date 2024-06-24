import { models as apiModels } from '@cornie-js/api-models';
import { Share } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { MouseEvent, MouseEventHandler } from 'react';

import { BaseGameListItem } from './BaseGameListItem';

export interface NonStartedGameListItemOptions {
  game: apiModels.GameV1;
  onButtonClick?: MouseEventHandler<Element>;
}

async function copyTextToClipboard(
  text: string,
  event: MouseEvent,
  onButtonClick?: MouseEventHandler<Element>,
): Promise<void> {
  await navigator.clipboard.writeText(text);

  if (onButtonClick !== undefined) {
    onButtonClick(event);
  }
}

function buildShareGameButtonOnClick(
  options: NonStartedGameListItemOptions,
): (event: MouseEvent) => void {
  return (event: MouseEvent) => {
    const currentUrl: URL = new URL(window.location.href);
    const joinGameUrl = new URL(
      `/games/join?gameId=${options.game.id}`,
      currentUrl,
    );

    void copyTextToClipboard(
      joinGameUrl.toString(),
      event,
      options.onButtonClick,
    );
  };
}

export const NonStartedGameListItem = (
  options: NonStartedGameListItemOptions,
) => {
  const button = (
    <Box component="div">
      <Button
        className="game-list-item-button"
        onClick={buildShareGameButtonOnClick(options)}
        startIcon={<Share />}
        type="button"
        variant="contained"
      >
        Share
      </Button>
    </Box>
  );

  return (
    <BaseGameListItem button={button} game={options.game}></BaseGameListItem>
  );
};
