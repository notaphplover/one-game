import { models as apiModels } from '@cornie-js/api-models';

import { Either } from '../../common/models/Either';
import { ActiveGameListItem } from './ActiveGameListItem';
import { BaseGameList, BaseGameListPaginationOptions } from './BaseGameList';

export interface ActiveGameListOptions {
  pagination?: BaseGameListPaginationOptions | undefined;
  title?: string | undefined;
  gamesResult: Either<string, apiModels.GameArrayV1> | null;
}

function buildGameItem(game: apiModels.GameV1, key: number): React.JSX.Element {
  return <ActiveGameListItem key={key} game={game} />;
}

export const ActiveGameList = (options: ActiveGameListOptions) => {
  return <BaseGameList buildGameItem={buildGameItem} {...options} />;
};
