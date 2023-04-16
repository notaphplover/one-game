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
    _gameCreateQuery: GameCreateQuery,
  ): QueryDeepPartialEntity<GameSlotDb>[] {
    return [];
  }
}
