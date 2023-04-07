import { Injectable } from '@nestjs/common';
import { Converter } from '@one-game-js/backend-common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class GameCreateQueryToGameSlotCreateQueryTypeOrmConverter
  implements Converter<GameCreateQuery, QueryDeepPartialEntity<GameSlotDb>[]>
{
  public convert(
    gameCreateQuery: GameCreateQuery,
  ): QueryDeepPartialEntity<GameSlotDb>[] {
    const gameSlotDbCreateQuery: QueryDeepPartialEntity<GameSlotDb>[] = [];

    for (const gameSlotId of gameCreateQuery.gameSlotIds) {
      gameSlotDbCreateQuery.push({
        game: {
          id: gameCreateQuery.id,
        },
        id: gameSlotId,
        userId: null,
      });
    }

    return gameSlotDbCreateQuery;
  }
}
