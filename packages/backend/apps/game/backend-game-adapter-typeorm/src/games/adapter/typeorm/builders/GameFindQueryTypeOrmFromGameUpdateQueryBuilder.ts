import { Builder } from '@cornie-js/backend-common';
import {
  GameFindQuery,
  GameUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { ObjectLiteral, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { GameFindQueryTypeOrmFromGameFindQueryBuilder } from './GameFindQueryTypeOrmFromGameFindQueryBuilder';

@Injectable()
export class GameFindQueryTypeOrmFromGameUpdateQueryBuilder
  implements
    Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [GameUpdateQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
    >
{
  readonly #gameFindQueryTypeOrmFromGameFindQueryBuilder: Builder<
    QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
    [GameFindQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
  >;

  constructor(
    @Inject(GameFindQueryTypeOrmFromGameFindQueryBuilder)
    gameFindQueryTypeOrmFromGameFindQueryBuilder: Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [GameFindQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
    >,
  ) {
    this.#gameFindQueryTypeOrmFromGameFindQueryBuilder =
      gameFindQueryTypeOrmFromGameFindQueryBuilder;
  }

  public build(
    gameUpdateQuery: GameUpdateQuery,
    queryBuilder: QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
  ): QueryBuilder<ObjectLiteral> & WhereExpressionBuilder {
    return this.#gameFindQueryTypeOrmFromGameFindQueryBuilder.build(
      gameUpdateQuery.gameFindQuery,
      queryBuilder,
    );
  }
}
