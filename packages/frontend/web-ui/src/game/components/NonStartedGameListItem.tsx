import { models as apiModels } from '@cornie-js/api-models';
import { JoinInner, Share } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { MouseEvent, MouseEventHandler } from 'react';

import { getSlug } from '../../common/helpers/getSlug';
import { PageName } from '../../common/models/PageName';
import { BaseGameListItem } from './BaseGameListItem';

export type NonStartedGameListItemButtonOptions =
  | boolean
  | {
      onclick: MouseEventHandler;
    };

export interface NonStartedGameListItemButtonsOptions {
  join?: NonStartedGameListItemButtonOptions;
  share?: NonStartedGameListItemButtonOptions;
}

export interface NonStartedGameListItemOptions {
  buttons?: NonStartedGameListItemButtonsOptions;
  game: apiModels.GameV1;
}

async function copyTextToClipboard(
  text: string,
  event: MouseEvent,
  onClick?: MouseEventHandler | undefined,
): Promise<void> {
  await navigator.clipboard.writeText(text);

  if (onClick !== undefined) {
    onClick(event);
  }
}

function buildShareGameButtonOnClick(
  options: NonStartedGameListItemOptions,
): (event: MouseEvent) => void {
  return (event: MouseEvent) => {
    const currentUrl: URL = new URL(window.location.href);
    const joinGameUrl = new URL(
      `${getSlug(PageName.joinGame)}?gameId=${options.game.id}`,
      currentUrl,
    );

    const onClickHandler: MouseEventHandler | undefined =
      'object' === typeof options.buttons?.share
        ? options.buttons.share.onclick
        : undefined;

    void copyTextToClipboard(joinGameUrl.toString(), event, onClickHandler);
  };
}

export const NonStartedGameListItem = (
  options: NonStartedGameListItemOptions,
) => {
  const gameListItemJoinButton: React.JSX.Element | undefined =
    options.buttons?.join === undefined ||
    options.buttons.join === false ? undefined : (
      <Button
        className="game-list-item-button"
        component="a"
        href={`${getSlug(PageName.joinGame)}?gameId=${options.game.id}`}
        startIcon={<JoinInner />}
      >
        Join
      </Button>
    );

  const gameListItemShareButton: React.JSX.Element | undefined =
    options.buttons?.share === undefined ||
    options.buttons.share === false ? undefined : (
      <Button
        className="game-list-item-button"
        onClick={buildShareGameButtonOnClick(options)}
        startIcon={<Share />}
        type="button"
        variant="contained"
      >
        Share
      </Button>
    );

  const buttonsContainer: React.JSX.Element = (
    <Box component="div">
      {gameListItemJoinButton}
      {gameListItemShareButton}
    </Box>
  );

  return (
    <BaseGameListItem
      button={buttonsContainer}
      game={options.game}
    ></BaseGameListItem>
  );
};
