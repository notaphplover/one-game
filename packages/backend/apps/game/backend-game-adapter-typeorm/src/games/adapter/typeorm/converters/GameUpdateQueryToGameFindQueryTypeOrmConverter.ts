import { Converter } from '@cornie-js/backend-common';
import {
  GameFindQuery,
  GameUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { ObjectLiteral, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { GameFindQueryToGameFindQueryTypeOrmConverter } from './GameFindQueryToGameFindQueryTypeOrmConverter';

@Injectable()
export class GameUpdateQueryToGameFindQueryTypeOrmConverter
  implements
    Converter<
      GameUpdateQuery,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
    >
{
  readonly #gameFindQueryToGameFindQueryTypeOrmConverter: Converter<
    GameFindQuery,
    QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
    QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
  >;

  constructor(
    @Inject(GameFindQueryToGameFindQueryTypeOrmConverter)
    gameFindQueryToGameFindQueryTypeOrmConverter: Converter<
      GameFindQuery,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
    >,
  ) {
    this.#gameFindQueryToGameFindQueryTypeOrmConverter =
      gameFindQueryToGameFindQueryTypeOrmConverter;
  }

  public convert(
    gameUpdateQuery: GameUpdateQuery,
    queryBuilder: QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
  ): QueryBuilder<ObjectLiteral> & WhereExpressionBuilder {
    return this.#gameFindQueryToGameFindQueryTypeOrmConverter.convert(
      gameUpdateQuery.gameFindQuery,
      queryBuilder,
    );
  }
}
