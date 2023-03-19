import { Converter } from '@one-game-js/backend-common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameDb } from '../models/GameDb';

export class GameCreateQueryToGameCreateQueryTypeOrmConverter
  implements Converter<GameCreateQuery, QueryDeepPartialEntity<GameDb>>
{
  public convert(
    gameCreateQuery: GameCreateQuery,
  ): QueryDeepPartialEntity<GameDb> {
    return {
      active: false,
      currentCard: null,
      currentColor: null,
      currentPlayingSlotIndex: null,
      id: gameCreateQuery.id,
    };
  }
}
