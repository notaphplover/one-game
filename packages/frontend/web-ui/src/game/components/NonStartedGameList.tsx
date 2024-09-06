import { models as apiModels } from '@cornie-js/api-models';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Snackbar } from '@mui/material';
import { Fragment } from 'react';

import { Either } from '../../common/models/Either';
import useConsecutiveSnackbars from '../hooks/useConsecutiveSnackbars';
import { GameWithSpecPair } from '../models/GameWithSpecPair';
import { BaseGameList, BaseGameListPaginationOptions } from './BaseGameList';
import {
  NonStartedGameListItem,
  NonStartedGameListItemButtonsOptions,
} from './NonStartedGameListItem';

const SNACKBAR_MESSAGE_CONTENT: string = 'Link copied to the clipboard';

export interface NonStartedGameListButtonsOptions {
  join?: boolean;
  share?: boolean;
}

export interface NonStartedGameListOptions {
  buttons?: NonStartedGameListButtonsOptions | undefined;
  pagination?: BaseGameListPaginationOptions | undefined;
  title?: string | undefined;
  gameResourcesListResult: Either<string, GameWithSpecPair[]> | null;
  usersMeResult: Either<string, apiModels.UserV1> | null;
}

function buildGameItemBuilder(
  enqueue: (messageContent: string) => void,
  options: NonStartedGameListOptions,
): (gameWithSpecPair: GameWithSpecPair, key: number) => React.JSX.Element {
  const onclick: () => void = () => {
    enqueue(SNACKBAR_MESSAGE_CONTENT);
  };

  const buttonOptions: NonStartedGameListItemButtonsOptions = {
    join: options.buttons?.join ?? false,
    share: options.buttons?.share === true ? { onclick } : false,
  };

  return (gameWithSpecPair: GameWithSpecPair, key: number) => (
    <NonStartedGameListItem
      key={key}
      game={gameWithSpecPair.game}
      gameSpec={gameWithSpecPair.spec}
      buttons={buttonOptions}
    />
  );
}

export const NonStartedGameList = (options: NonStartedGameListOptions) => {
  const { close, dequeue, enqueue, message, open } = useConsecutiveSnackbars();

  return (
    <>
      <Snackbar
        action={
          <Fragment>
            <IconButton aria-label="close" color="inherit" onClick={close}>
              <CloseIcon />
            </IconButton>
          </Fragment>
        }
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'top',
        }}
        autoHideDuration={3000}
        className="snackbar"
        message={message?.content}
        onClose={close}
        open={open}
        TransitionProps={{ onExited: dequeue }}
      ></Snackbar>
      <BaseGameList
        buildGameItem={buildGameItemBuilder(enqueue, options)}
        gameResourcesListResult={options.gameResourcesListResult}
        pagination={options.pagination}
        title={options.title}
      />
    </>
  );
};
