import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { GameSpecFindQuerySortOption } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

const MAP: {
  [TKey in apiModels.GameSpecSortOptionV1]: GameSpecFindQuerySortOption;
} = {
  gameIds: GameSpecFindQuerySortOption.gameIds,
};

@Injectable()
export class GameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder
  implements
    Builder<GameSpecFindQuerySortOption, [apiModels.GameSpecSortOptionV1]>
{
  public build(
    gameSpecSortOptionV1: apiModels.GameSpecSortOptionV1,
  ): GameSpecFindQuerySortOption {
    return MAP[gameSpecSortOptionV1];
  }
}
