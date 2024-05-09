import { models as apiModels } from '@cornie-js/api-models';
import { Typography, Box } from '@mui/material';

import { Either } from '../../common/models/Either';
import { GameListItem } from './GameListItem';

function getNoGamesContent(): React.JSX.Element {
  return (
    <Typography variant="h5" className="game-list-text" component="h5">
      No games found.
    </Typography>
  );
}

function getGamesContent(
  gamesResult: Either<string, apiModels.GameArrayV1> | null,
): React.JSX.Element | React.JSX.Element[] {
  if (gamesResult === null) {
    return getNoGamesContent();
  }

  if (gamesResult.isRight) {
    if (gamesResult.value.length === 0) {
      return getNoGamesContent();
    }

    return gamesResult.value.map((game: apiModels.GameV1) => (
      <GameListItem key={game.id} game={game} />
    ));
  }

  return (
    <Typography variant="h5" className="game-list-text" component="h5">
      An error has occurred. Please try again later.
    </Typography>
  );
}

export const GameList = ({
  gamesResult,
}: {
  gamesResult: Either<string, apiModels.GameArrayV1> | null;
}) => {
  return <Box component="div">{getGamesContent(gamesResult)}</Box>;
};
