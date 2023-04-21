import { Injectable } from '@nestjs/common';
import { Converter } from '@one-game-js/backend-common';
import { DeepPartial } from 'typeorm';

import { GameSlotCreateQuery } from '../../../domain/query/GameSlotCreateQuery';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter
  implements Converter<GameSlotCreateQuery, DeepPartial<GameSlotDb>>
{
  public convert(
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
