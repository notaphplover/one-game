import { Injectable } from '@nestjs/common';
import { Converter } from '@one-game-js/backend-common';

import { GameDirection } from '../../../domain/models/GameDirection';
import { GameDirectionDb } from '../models/GameDirectionDb';

const GAME_DIRECTION_TO_GAME_DIRECTION_DB_MAP: {
  [TKey in GameDirection]: GameDirectionDb;
} = {
  [GameDirection.antiClockwise]: GameDirectionDb.antiClockwise,
  [GameDirection.clockwise]: GameDirectionDb.clockwise,
};

@Injectable()
export class GameDirectionToGameDirectionDbConverter
  implements Converter<GameDirection, GameDirectionDb>
{
  public convert(gameDirection: GameDirection): GameDirectionDb {
    return GAME_DIRECTION_TO_GAME_DIRECTION_DB_MAP[gameDirection];
  }
}
