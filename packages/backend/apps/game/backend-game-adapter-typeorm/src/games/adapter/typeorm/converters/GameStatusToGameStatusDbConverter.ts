import { Converter } from '@cornie-js/backend-common';
import { GameStatus } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

import { GameStatusDb } from '../models/GameStatusDb';

const GAME_STATUS_TO_GAME_STATUS_DB_MAP: {
  [TKey in GameStatus]: GameStatusDb;
} = {
  [GameStatus.active]: GameStatusDb.active,
  [GameStatus.nonStarted]: GameStatusDb.nonStarted,
};

@Injectable()
export class GameStatusToGameStatusDbConverter
  implements Converter<GameStatus, GameStatusDb>
{
  public convert(gameStatus: GameStatus): GameStatusDb {
    return GAME_STATUS_TO_GAME_STATUS_DB_MAP[gameStatus];
  }
}
