import { Builder } from '@cornie-js/backend-common';
import { GameDirection } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

import { GameDirectionDb } from '../models/GameDirectionDb';

const GAME_DIRECTION_TO_GAME_DIRECTION_DB_MAP: {
  [TKey in GameDirection]: GameDirectionDb;
} = {
  [GameDirection.antiClockwise]: GameDirectionDb.antiClockwise,
  [GameDirection.clockwise]: GameDirectionDb.clockwise,
};

@Injectable()
export class GameDirectionDbFromGameDirectionBuilder
  implements Builder<GameDirectionDb, [GameDirection]>
{
  public build(gameDirection: GameDirection): GameDirectionDb {
    return GAME_DIRECTION_TO_GAME_DIRECTION_DB_MAP[gameDirection];
  }
}
