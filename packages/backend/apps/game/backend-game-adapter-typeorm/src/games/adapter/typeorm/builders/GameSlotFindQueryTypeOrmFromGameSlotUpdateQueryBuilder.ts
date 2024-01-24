import { Builder } from '@cornie-js/backend-common';
import {
  GameSlotFindQuery,
  GameSlotUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { ObjectLiteral, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { GameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder } from './GameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder';

@Injectable()
export class GameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder
  implements
    Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [
        GameSlotUpdateQuery,
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      ]
    >
{
  readonly #gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder: Builder<
    QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
    [GameSlotFindQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
  >;

  constructor(
    @Inject(GameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder)
    gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder: Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [GameSlotFindQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
    >,
  ) {
    this.#gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder =
      gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder;
  }

  public build(
    gameSlotUpdateQuery: GameSlotUpdateQuery,
    queryBuilder: QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
  ): QueryBuilder<ObjectLiteral> & WhereExpressionBuilder {
    return this.#gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder.build(
      gameSlotUpdateQuery.gameSlotFindQuery,
      queryBuilder,
    );
  }
}
