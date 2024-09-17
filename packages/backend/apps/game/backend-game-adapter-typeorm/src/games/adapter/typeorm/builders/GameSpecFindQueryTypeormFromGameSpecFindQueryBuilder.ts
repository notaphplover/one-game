import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import {
  GameSpecFindQuery,
  GameSpecFindQuerySortOption,
} from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';
import {
  InstanceChecker,
  QueryBuilder,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { BaseFindQueryToFindQueryTypeOrmBuilder } from '../../../../foundation/db/adapter/typeorm/builders/BaseFindQueryToFindQueryTypeOrmBuilder';
import { GameSpecDb } from '../models/GameSpecDb';

@Injectable()
export class GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder
  extends BaseFindQueryToFindQueryTypeOrmBuilder
  implements
    Builder<
      QueryBuilder<GameSpecDb> & WhereExpressionBuilder,
      [GameSpecFindQuery, QueryBuilder<GameSpecDb> & WhereExpressionBuilder]
    >
{
  public build(
    gameSpecFindQuery: GameSpecFindQuery,
    queryBuilder: QueryBuilder<GameSpecDb> & WhereExpressionBuilder,
  ): QueryBuilder<GameSpecDb> & WhereExpressionBuilder {
    const gameSpecPropertiesPrefix: string = this._getEntityPrefix(
      queryBuilder,
      GameSpecDb,
    );

    this.#processGameIds(
      gameSpecFindQuery,
      gameSpecPropertiesPrefix,
      queryBuilder,
    );

    if (gameSpecFindQuery.limit !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);
      queryBuilder = queryBuilder.limit(gameSpecFindQuery.limit);
    }

    if (gameSpecFindQuery.offset !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);
      queryBuilder = queryBuilder.offset(gameSpecFindQuery.offset);
    }

    this.#processSort(
      gameSpecFindQuery,
      gameSpecPropertiesPrefix,
      queryBuilder,
    );

    return queryBuilder;
  }

  #assertSelectQueryBuilderIsUsedForSelectFilters(
    queryBuilder: QueryBuilder<GameSpecDb>,
  ): asserts queryBuilder is SelectQueryBuilder<GameSpecDb> {
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

  #processGameIds(
    gameSpecFindQuery: GameSpecFindQuery,
    gameSpecPropertiesPrefix: string,
    queryBuilder: QueryBuilder<GameSpecDb> & WhereExpressionBuilder,
  ): void {
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
  }

  #processSort(
    gameSpecFindQuery: GameSpecFindQuery,
    gameSpecPropertiesPrefix: string,
    queryBuilder: QueryBuilder<GameSpecDb> & WhereExpressionBuilder,
  ): void {
    if (gameSpecFindQuery.sort !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);

      switch (gameSpecFindQuery.sort) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        case GameSpecFindQuerySortOption.gameIds:
          if (gameSpecFindQuery.gameIds === undefined) {
            throw new AppError(
              AppErrorKind.unprocessableOperation,
              'Unable to sort game specs by ids. Reason: game id list was not provided',
            );
          }

          if (gameSpecFindQuery.gameIds.length > 1) {
            /*
             * TODO: Consider extracting this to support different dbs.
             * The query builder has a datasource with options with a discriminator good enough to detect the current db.
             */
            queryBuilder = queryBuilder.addOrderBy(
              `array_position(ARRAY[:...${GameSpecDb.name}games], ${gameSpecPropertiesPrefix}game)`,
            );
          }
      }
    }
  }
}
