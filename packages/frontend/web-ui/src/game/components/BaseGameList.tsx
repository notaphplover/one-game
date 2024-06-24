import { models as apiModels } from '@cornie-js/api-models';
import { Typography, Box } from '@mui/material';

import { Either } from '../../common/models/Either';

export interface BaseGameListOptions {
  gamesResult: Either<string, apiModels.GameArrayV1> | null;
  buildGameItem(game: apiModels.GameV1, key: number): React.JSX.Element;
}

function getNoGamesContent(): React.JSX.Element {
  return (
    <Typography variant="h5" className="game-list-text" component="h5">
      No games found.
    </Typography>
  );
}

function getGamesContent(
  options: BaseGameListOptions,
): React.JSX.Element | React.JSX.Element[] {
  if (options.gamesResult === null) {
    return getNoGamesContent();
  }

  if (options.gamesResult.isRight) {
    if (options.gamesResult.value.length === 0) {
      return getNoGamesContent();
    }

    return options.gamesResult.value.map(
      (game: apiModels.GameV1, index: number) =>
        options.buildGameItem(game, index),
    );
  }

  return (
    <Typography variant="h5" className="game-list-text" component="h5">
      An error has occurred. Please try again later.
    </Typography>
  );
}

export const BaseGameList = (options: BaseGameListOptions) => {
  return <Box component="div">{getGamesContent(options)}</Box>;
};
