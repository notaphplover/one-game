import { Converter } from '@cornie-js/backend-common';
import { GameSlotCreateQuery } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';

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
