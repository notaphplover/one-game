import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import {
  GameFindQuery,
  GameSlotFindQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import {
  InstanceChecker,
  ObjectLiteral,
  QueryBuilder,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { BaseFindQueryToFindQueryTypeOrmConverter } from '../../../../foundation/db/adapter/typeorm/converters/BaseFindQueryToFindQueryTypeOrmConverter';
import { GameDb } from '../models/GameDb';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder } from './GameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder';

@Injectable()
export class GameFindQueryTypeOrmFromGameFindQueryBuilder
  extends BaseFindQueryToFindQueryTypeOrmConverter
  implements
    Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [GameFindQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
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
    super();

    this.#gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder =
      gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder;
  }

  public build(
    gameFindQuery: GameFindQuery,
    queryBuilder: QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
  ): QueryBuilder<ObjectLiteral> & WhereExpressionBuilder {
    const gamePropertiesPrefix: string = this._getEntityPrefix(
      queryBuilder,
      GameDb,
    );

    if (InstanceChecker.isSelectQueryBuilder(queryBuilder)) {
      queryBuilder = queryBuilder.leftJoinAndSelect(
        `${gamePropertiesPrefix}gameSlotsDb`,
        `${GameSlotDb.name}Joined`,
      );
    }

    if (gameFindQuery.id !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${gamePropertiesPrefix}id = :${GameDb.name}id`,
        {
          [`${GameDb.name}id`]: gameFindQuery.id,
        },
      );
    }

    if (gameFindQuery.limit !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);
      queryBuilder = queryBuilder.limit(gameFindQuery.limit);
    }

    if (gameFindQuery.gameSlotFindQuery !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);

      queryBuilder = this.#findByGameSlotFindQuery(
        gameFindQuery.gameSlotFindQuery,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        queryBuilder,
      );
    }

    if (gameFindQuery.state !== undefined) {
      if (gameFindQuery.state.currentPlayingSlotIndex !== undefined) {
        queryBuilder = queryBuilder.andWhere(
          `${gamePropertiesPrefix}currentPlayingSlotIndex = :${GameDb.name}currentPlayingSlotIndex`,
          {
            [`${GameDb.name}currentPlayingSlotIndex`]:
              gameFindQuery.state.currentPlayingSlotIndex,
          },
        );
      }
    }

    if (gameFindQuery.status !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${gamePropertiesPrefix}status = :${GameDb.name}status`,
        {
          [`${GameDb.name}status`]: gameFindQuery.status,
        },
      );
    }

    if (gameFindQuery.offset !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);
      queryBuilder = queryBuilder.offset(gameFindQuery.offset);
    }

    return queryBuilder;
  }

  #assertSelectQueryBuilderIsUsedForSelectFilters(
    queryBuilder: QueryBuilder<ObjectLiteral>,
  ): asserts queryBuilder is SelectQueryBuilder<ObjectLiteral> {
    if (!InstanceChecker.isSelectQueryBuilder(queryBuilder)) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Error trying to filter a game with slot filter conditions in a non search context`,
      );
    }
  }

  #findByGameSlotFindQuery(
    gameSlotFindQuery: GameSlotFindQuery,
    selectQueryBuilder: SelectQueryBuilder<ObjectLiteral>,
  ): SelectQueryBuilder<ObjectLiteral> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let subQueryBuilder: SelectQueryBuilder<ObjectLiteral> = selectQueryBuilder
      .subQuery()
      .select(`"${GameSlotDb.name}".game_Id`)
      .distinct(true)
      .from(GameSlotDb, GameSlotDb.name);

    subQueryBuilder =
      this.#gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder.build(
        gameSlotFindQuery,
        subQueryBuilder,
      ) as SelectQueryBuilder<ObjectLiteral>;

    selectQueryBuilder = selectQueryBuilder.andWhere(
      `${GameDb.name}.id IN (${subQueryBuilder.getQuery()})`,
    );

    selectQueryBuilder.setParameters(subQueryBuilder.getParameters());

    return selectQueryBuilder;
  }
}
