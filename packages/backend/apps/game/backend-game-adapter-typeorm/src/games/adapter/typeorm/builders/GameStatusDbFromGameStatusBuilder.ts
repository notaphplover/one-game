import { Builder } from '@cornie-js/backend-common';
import { GameStatus } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

import { GameStatusDb } from '../models/GameStatusDb';

const GAME_STATUS_TO_GAME_STATUS_DB_MAP: {
  [TKey in GameStatus]: GameStatusDb;
} = {
  [GameStatus.active]: GameStatusDb.active,
  [GameStatus.nonStarted]: GameStatusDb.nonStarted,
  [GameStatus.finished]: GameStatusDb.finished,
};

@Injectable()
export class GameStatusDbFromGameStatusBuilder
  implements Builder<GameStatusDb, [GameStatus]>
{
  public build(gameStatus: GameStatus): GameStatusDb {
    return GAME_STATUS_TO_GAME_STATUS_DB_MAP[gameStatus];
  }
}
