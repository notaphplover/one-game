import { Converter } from '@cornie-js/backend-common';
import {
  GameFindQuery,
  GameUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { GameDb } from '../models/GameDb';
import { GameFindQueryToGameFindQueryTypeOrmConverter } from './GameFindQueryToGameFindQueryTypeOrmConverter';

@Injectable()
export class GameUpdateQueryToGameFindQueryTypeOrmConverter
  implements
    Converter<
      GameUpdateQuery,
      QueryBuilder<GameDb> & WhereExpressionBuilder,
      QueryBuilder<GameDb> & WhereExpressionBuilder
    >
{
  readonly #gameFindQueryToGameFindQueryTypeOrmConverter: Converter<
    GameFindQuery,
    QueryBuilder<GameDb> & WhereExpressionBuilder,
    QueryBuilder<GameDb> & WhereExpressionBuilder
  >;

  constructor(
    @Inject(GameFindQueryToGameFindQueryTypeOrmConverter)
    gameFindQueryToGameFindQueryTypeOrmConverter: Converter<
      GameFindQuery,
      QueryBuilder<GameDb> & WhereExpressionBuilder,
      QueryBuilder<GameDb> & WhereExpressionBuilder
    >,
  ) {
    this.#gameFindQueryToGameFindQueryTypeOrmConverter =
      gameFindQueryToGameFindQueryTypeOrmConverter;
  }

  public convert(
    gameUpdateQuery: GameUpdateQuery,
    queryBuilder: QueryBuilder<GameDb> & WhereExpressionBuilder,
  ): QueryBuilder<GameDb> & WhereExpressionBuilder {
    return this.#gameFindQueryToGameFindQueryTypeOrmConverter.convert(
      gameUpdateQuery.gameFindQuery,
      queryBuilder,
    );
  }
}
