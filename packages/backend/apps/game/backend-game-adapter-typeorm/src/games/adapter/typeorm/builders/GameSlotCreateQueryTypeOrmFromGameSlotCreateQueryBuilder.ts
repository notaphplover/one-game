import { Builder } from '@cornie-js/backend-common';
import { GameSlotCreateQuery } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';

import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class GameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder
  implements Builder<DeepPartial<GameSlotDb>, [GameSlotCreateQuery]>
{
  public build(
    gameSlotCreateQuery: GameSlotCreateQuery,
  ): DeepPartial<GameSlotDb> {
    return {
      game: {
        id: gameSlotCreateQuery.gameId,
      },
      id: gameSlotCreateQuery.id,
      position: gameSlotCreateQuery.position,
      userId: gameSlotCreateQuery.userId,
    };
  }
}
