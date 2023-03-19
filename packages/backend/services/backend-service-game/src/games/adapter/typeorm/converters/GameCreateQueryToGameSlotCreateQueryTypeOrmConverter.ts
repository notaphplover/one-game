import { Converter } from '@one-game-js/backend-common';
import { DeepPartial } from 'typeorm';

import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameSlotDb } from '../models/GameSlotDb';

export class GameCreateQueryToGameSlotCreateQueryTypeOrmConverter
  implements Converter<GameCreateQuery, DeepPartial<GameSlotDb>[]>
{
  public convert(gameCreateQuery: GameCreateQuery): DeepPartial<GameSlotDb>[] {
    const gameSlotDbCreateQuery: DeepPartial<GameSlotDb>[] = [];

    for (const gameSlotId of gameCreateQuery.gameSlotIds) {
      gameSlotDbCreateQuery.push({
        gameId: gameCreateQuery.id,
        id: gameSlotId,
        userId: null,
      });
    }

    return gameSlotDbCreateQuery;
  }
}
