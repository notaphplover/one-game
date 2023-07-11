import { Converter } from '@cornie-js/backend-common';
import {
  GameSlotFindQuery,
  GameSlotUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter } from './GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter';

@Injectable()
export class GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter
  implements
    Converter<
      GameSlotUpdateQuery,
      QueryBuilder<GameSlotDb> & WhereExpressionBuilder,
      QueryBuilder<GameSlotDb> & WhereExpressionBuilder
    >
{
  readonly #gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter: Converter<
    GameSlotFindQuery,
    QueryBuilder<GameSlotDb> & WhereExpressionBuilder,
    QueryBuilder<GameSlotDb> & WhereExpressionBuilder
  >;

  constructor(
    @Inject(GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter)
    gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter: Converter<
      GameSlotFindQuery,
      QueryBuilder<GameSlotDb> & WhereExpressionBuilder,
      QueryBuilder<GameSlotDb> & WhereExpressionBuilder
    >,
  ) {
    this.#gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter =
      gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter;
  }

  public convert(
    gameSlotUpdateQuery: GameSlotUpdateQuery,
    queryBuilder: QueryBuilder<GameSlotDb> & WhereExpressionBuilder,
  ): QueryBuilder<GameSlotDb> & WhereExpressionBuilder {
    return this.#gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter.convert(
      gameSlotUpdateQuery.gameSlotFindQuery,
      queryBuilder,
    );
  }
}
