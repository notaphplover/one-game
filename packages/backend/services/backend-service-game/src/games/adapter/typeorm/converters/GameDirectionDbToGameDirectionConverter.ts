import { Injectable } from '@nestjs/common';
import { Converter } from '@one-game-js/backend-common';

import { GameDirection } from '../../../domain/models/GameDirection';
import { GameDirectionDb } from '../models/GameDirectionDb';

const GAME_DIRECTION_DB_TO_GAME_DIRECTION_MAP: {
  [TKey in GameDirectionDb]: GameDirection;
} = {
  [GameDirectionDb.antiClockwise]: GameDirection.antiClockwise,
  [GameDirectionDb.clockwise]: GameDirection.clockwise,
};

@Injectable()
export class GameDirectionDbToGameDirectionConverter
  implements Converter<GameDirectionDb, GameDirection>
{
  public convert(gameDirectionDb: GameDirectionDb): GameDirection {
    return GAME_DIRECTION_DB_TO_GAME_DIRECTION_MAP[gameDirectionDb];
  }
}
