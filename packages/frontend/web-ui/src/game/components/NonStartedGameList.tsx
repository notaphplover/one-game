import { models as apiModels } from '@cornie-js/api-models';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Snackbar } from '@mui/material';
import { Fragment } from 'react';

import { Either } from '../../common/models/Either';
import useConsecutiveSnackbars from '../hooks/useConsecutiveSnackbars';
import { BaseGameList, BaseGameListPaginationOptions } from './BaseGameList';
import { NonStartedGameListItem } from './NonStartedGameListItem';

const SNACKBAR_MESSAGE_CONTENT: string = 'Link copied to the clipboard';

export interface NonStartedGameListOptions {
  pagination?: BaseGameListPaginationOptions | undefined;
  title?: string | undefined;
  gamesResult: Either<string, apiModels.GameArrayV1> | null;
}

function buildGameItemBuilder(
  enqueue: (messageContent: string) => void,
): (game: apiModels.GameV1, key: number) => React.JSX.Element {
  const onClick: () => void = () => {
    enqueue(SNACKBAR_MESSAGE_CONTENT);
  };

  return (game: apiModels.GameV1, key: number) => (
    <NonStartedGameListItem key={key} game={game} onButtonClick={onClick} />
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
        buildGameItem={buildGameItemBuilder(enqueue)}
        {...options}
      />
    </>
  );
};
