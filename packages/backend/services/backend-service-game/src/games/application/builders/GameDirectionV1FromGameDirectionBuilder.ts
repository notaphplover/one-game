import { Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import { GameDirection } from '../../domain/models/GameDirection';

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
