import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { GameDirection } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

const GAME_DIRECTION_TO_GAME_DIRECTION_V1_MAP: {
  [TKey in GameDirection]: apiModels.GameDirectionV1;
} = {
  [GameDirection.antiClockwise]: 'antiClockwise',
  [GameDirection.clockwise]: 'clockwise',
};

@Injectable()
export class GameDirectionV1FromGameDirectionBuilder
  implements Builder<apiModels.GameDirectionV1, [GameDirection]>
{
  public build(gameDirection: GameDirection): apiModels.GameDirectionV1 {
    return GAME_DIRECTION_TO_GAME_DIRECTION_V1_MAP[gameDirection];
  }
}
