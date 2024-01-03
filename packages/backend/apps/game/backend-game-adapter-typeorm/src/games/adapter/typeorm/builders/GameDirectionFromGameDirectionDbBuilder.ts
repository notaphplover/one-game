import { Builder } from '@cornie-js/backend-common';
import { GameDirection } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

import { GameDirectionDb } from '../models/GameDirectionDb';

const GAME_DIRECTION_DB_TO_GAME_DIRECTION_MAP: {
  [TKey in GameDirectionDb]: GameDirection;
} = {
  [GameDirectionDb.antiClockwise]: GameDirection.antiClockwise,
  [GameDirectionDb.clockwise]: GameDirection.clockwise,
};

@Injectable()
export class GameDirectionFromGameDirectionDbBuilder
  implements Builder<GameDirection, [GameDirectionDb]>
{
  public build(gameDirectionDb: GameDirectionDb): GameDirection {
    return GAME_DIRECTION_DB_TO_GAME_DIRECTION_MAP[gameDirectionDb];
  }
}
