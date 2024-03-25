import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { GameActionFindQuery } from '@cornie-js/backend-game-domain/gameActions';
import { Injectable } from '@nestjs/common';
import {
  InstanceChecker,
  ObjectLiteral,
  QueryBuilder,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { BaseFindQueryToFindQueryTypeOrmBuilder } from '../../../../foundation/db/adapter/typeorm/builders/BaseFindQueryToFindQueryTypeOrmBuilder';
import { GameActionDb } from '../models/GameActionDb';

@Injectable()
export class GameActionFindQueryTypeOrmFromGameActionFindQueryBuilder
  extends BaseFindQueryToFindQueryTypeOrmBuilder
  implements
    Builder<
      QueryBuilder<GameActionDb> & WhereExpressionBuilder,
      [GameActionFindQuery, QueryBuilder<GameActionDb> & WhereExpressionBuilder]
    >
{
  public build(
    gameActionFindQuery: GameActionFindQuery,
    queryBuilder: QueryBuilder<GameActionDb> & WhereExpressionBuilder,
  ): QueryBuilder<GameActionDb> & WhereExpressionBuilder {
    const gameActionPropertiesPrefix: string = this._getEntityPrefix(
      queryBuilder,
      GameActionDb,
    );

    if (gameActionFindQuery.gameId !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${gameActionPropertiesPrefix}game = :${GameActionDb.name}game`,
        {
          [`${GameActionDb.name}game`]: gameActionFindQuery.gameId,
        },
      );
    }

    if (gameActionFindQuery.id !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${gameActionPropertiesPrefix}id = :${GameActionDb.name}id`,
        {
          [`${GameActionDb.name}id`]: gameActionFindQuery.id,
        },
      );
    }

    if (gameActionFindQuery.limit !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);
      queryBuilder = queryBuilder.limit(gameActionFindQuery.limit);
    }

    if (gameActionFindQuery.position?.gt !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${gameActionPropertiesPrefix}position > :${GameActionDb.name}position`,
        {
          [`${GameActionDb.name}position`]: gameActionFindQuery.position.gt,
        },
      );
    }

    return queryBuilder;
  }

  #assertSelectQueryBuilderIsUsedForSelectFilters<T extends ObjectLiteral>(
    queryBuilder: QueryBuilder<T>,
  ): asserts queryBuilder is SelectQueryBuilder<T> {
    if (!InstanceChecker.isSelectQueryBuilder(queryBuilder)) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Error trying to filter a game with slot filter conditions in a non search context`,
      );
    }
  }
}
