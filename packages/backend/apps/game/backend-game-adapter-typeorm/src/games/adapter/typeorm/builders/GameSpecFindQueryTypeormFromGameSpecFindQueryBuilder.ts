import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { GameSpecFindQuery } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';
import {
  InstanceChecker,
  ObjectLiteral,
  QueryBuilder,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { BaseFindQueryToFindQueryTypeOrmConverter } from '../../../../foundation/db/adapter/typeorm/converters/BaseFindQueryToFindQueryTypeOrmConverter';
import { GameSpecDb } from '../models/GameSpecDb';

@Injectable()
export class GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder
  extends BaseFindQueryToFindQueryTypeOrmConverter
  implements
    Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [GameSpecFindQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
    >
{
  public build(
    gameSpecFindQuery: GameSpecFindQuery,
    queryBuilder: QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
  ): QueryBuilder<ObjectLiteral> & WhereExpressionBuilder {
    const gameSpecPropertiesPrefix: string = this._getEntityPrefix(
      queryBuilder,
      GameSpecDb,
    );

    if (gameSpecFindQuery.gameIds !== undefined) {
      if (gameSpecFindQuery.gameIds.length > 0) {
        if (this.#isArrayWithOneElement(gameSpecFindQuery.gameIds)) {
          const [gameId]: [string] = gameSpecFindQuery.gameIds;

          queryBuilder.andWhere(
            `${gameSpecPropertiesPrefix}game = :${GameSpecDb.name}game`,
            {
              [`${GameSpecDb.name}game`]: gameId,
            },
          );
        } else {
          queryBuilder.andWhere(
            `${gameSpecPropertiesPrefix}game IN (:...${GameSpecDb.name}games)`,
            {
              [`${GameSpecDb.name}games`]: gameSpecFindQuery.gameIds,
            },
          );
        }
      }
    }

    if (gameSpecFindQuery.limit !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);
      queryBuilder = queryBuilder.limit(gameSpecFindQuery.limit);
    }

    if (gameSpecFindQuery.offset !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);
      queryBuilder = queryBuilder.offset(gameSpecFindQuery.offset);
    }

    return queryBuilder;
  }

  #assertSelectQueryBuilderIsUsedForSelectFilters(
    queryBuilder: QueryBuilder<ObjectLiteral>,
  ): asserts queryBuilder is SelectQueryBuilder<ObjectLiteral> {
    if (!InstanceChecker.isSelectQueryBuilder(queryBuilder)) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Error trying to filter a game spec in a non search context`,
      );
    }
  }

  #isArrayWithOneElement<T>(array: T[]): array is [T] {
    return array.length === 1;
  }
}
