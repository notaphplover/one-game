import { models as apiModels } from '@cornie-js/api-models';

import { Either } from '../../common/models/Either';
import { BaseGameList, BaseGameListPaginationOptions } from './BaseGameList';
import { FinishedGameListItem } from './FinishedGameListItem';

export interface FinishedGameListOptions {
  pagination?: BaseGameListPaginationOptions | undefined;
  title?: string | undefined;
  gameResourcesListResult: Either<string, apiModels.GameArrayV1> | null;
}

function buildGameItem(game: apiModels.GameV1, key: number): React.JSX.Element {
  return <FinishedGameListItem key={key} game={game} />;
}

export const FinishedGameList = (options: FinishedGameListOptions) => {
  return <BaseGameList buildGameItem={buildGameItem} {...options} />;
};
