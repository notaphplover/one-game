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

import { BaseFindQueryToFindQueryTypeOrmBuilder } from '../../../../foundation/db/adapter/typeorm/builders/BaseFindQueryToFindQueryTypeOrmBuilder';
import { NumberToBooleanTransformer } from '../../../../foundation/db/adapter/typeorm/transformers/NumberToBooleanTransformer';
import { GameDb } from '../models/GameDb';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder } from './GameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder';

@Injectable()
export class GameFindQueryTypeOrmFromGameFindQueryBuilder
  extends BaseFindQueryToFindQueryTypeOrmBuilder
  implements
    Builder<
      QueryBuilder<GameDb> & WhereExpressionBuilder,
      [GameFindQuery, QueryBuilder<GameDb> & WhereExpressionBuilder]
    >
{
  readonly #gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder: Builder<
    QueryBuilder<GameSlotDb> & WhereExpressionBuilder,
    [GameSlotFindQuery, QueryBuilder<GameSlotDb> & WhereExpressionBuilder]
  >;

  readonly #numberToBooleanTransformer: NumberToBooleanTransformer;

  constructor(
    @Inject(GameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder)
    gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder: Builder<
      QueryBuilder<GameSlotDb> & WhereExpressionBuilder,
      [GameSlotFindQuery, QueryBuilder<GameSlotDb> & WhereExpressionBuilder]
    >,
    @Inject(NumberToBooleanTransformer)
    numberToBooleanTransformer: NumberToBooleanTransformer,
  ) {
    super();

    this.#gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder =
      gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder;
    this.#numberToBooleanTransformer = numberToBooleanTransformer;
  }

  public build(
    gameFindQuery: GameFindQuery,
    queryBuilder: QueryBuilder<GameDb> & WhereExpressionBuilder,
  ): QueryBuilder<GameDb> & WhereExpressionBuilder {
    const gamePropertiesPrefix: string = this._getEntityPrefix(
      queryBuilder,
      GameDb,
    );

    if (this.#isPaginatedQuery(gameFindQuery)) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);

      const gameIdsAlias: string = `${GameDb.name}Ids`;
      const gameIdsPropertyPrefix: string = `${gameIdsAlias}.`;

      queryBuilder = queryBuilder
        .innerJoin(
          (
            gameIdsQueryBuilder: SelectQueryBuilder<GameDb>,
          ): SelectQueryBuilder<GameDb> => {
            gameIdsQueryBuilder = gameIdsQueryBuilder
              .subQuery()
              .select(`"${gameIdsAlias}".id`)
              .distinct(true)
              .from(GameDb, gameIdsAlias)
              .leftJoin(
                `${gameIdsPropertyPrefix}gameSlotsDb`,
                `${GameSlotDb.name}IdsJoined`,
              );

            gameIdsQueryBuilder = this.#applyGameFindQueryFilters(
              gameIdsPropertyPrefix,
              gameFindQuery,
              gameIdsQueryBuilder,
            );

            if (gameFindQuery.limit !== undefined) {
              gameIdsQueryBuilder = gameIdsQueryBuilder.limit(
                gameFindQuery.limit,
              );
            }

            if (gameFindQuery.offset !== undefined) {
              gameIdsQueryBuilder = gameIdsQueryBuilder.offset(
                gameFindQuery.offset,
              );
            }

            return gameIdsQueryBuilder;
          },
          gameIdsAlias,
          `"${gameIdsAlias}".id = "GameDb".id`,
        )
        .leftJoinAndSelect(
          `${gamePropertiesPrefix}gameSlotsDb`,
          `${GameSlotDb.name}Joined`,
        );
    } else {
      if (InstanceChecker.isSelectQueryBuilder(queryBuilder)) {
        queryBuilder = queryBuilder.leftJoinAndSelect(
          `${gamePropertiesPrefix}gameSlotsDb`,
          `${GameSlotDb.name}Joined`,
        );
      }

      queryBuilder = this.#applyGameFindQueryFilters(
        gamePropertiesPrefix,
        gameFindQuery,
        queryBuilder,
      );
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
    gamePropertiesPrefix: string,
    gameSlotFindQuery: GameSlotFindQuery,
    selectQueryBuilder: SelectQueryBuilder<GameDb>,
  ): QueryBuilder<GameDb> & WhereExpressionBuilder {
    let subQueryBuilder: SelectQueryBuilder<GameSlotDb> = selectQueryBuilder
      .subQuery()
      .select(`"${GameSlotDb.name}".game_Id`)
      .distinct(true)
      .from(GameSlotDb, GameSlotDb.name);

    subQueryBuilder =
      this.#gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder.build(
        gameSlotFindQuery,
        subQueryBuilder,
      ) as SelectQueryBuilder<GameSlotDb>;

    selectQueryBuilder = selectQueryBuilder.andWhere(
      `${gamePropertiesPrefix}id IN (${subQueryBuilder.getQuery()})`,
    );

    selectQueryBuilder.setParameters(subQueryBuilder.getParameters());

    return selectQueryBuilder as QueryBuilder<GameDb> & WhereExpressionBuilder;
  }

  #applyGameFindQueryFilters<
    T extends QueryBuilder<GameDb> & WhereExpressionBuilder,
  >(
    gamePropertiesPrefix: string,
    gameFindQuery: GameFindQuery,
    queryBuilder: T,
  ): T {
    let queryBuilderResult: QueryBuilder<GameDb> & WhereExpressionBuilder =
      queryBuilder;

    if (gameFindQuery.id !== undefined) {
      queryBuilderResult = queryBuilderResult.andWhere(
        `${gamePropertiesPrefix}id = :${gamePropertiesPrefix}id`,
        {
          [`${gamePropertiesPrefix}id`]: gameFindQuery.id,
        },
      );
    }

    if (gameFindQuery.isPublic !== undefined) {
      queryBuilderResult = queryBuilderResult.andWhere(
        `${gamePropertiesPrefix}isPublic = :${gamePropertiesPrefix}isPublic`,
        {
          [`${gamePropertiesPrefix}isPublic`]:
            this.#numberToBooleanTransformer.to(gameFindQuery.isPublic),
        },
      );
    }

    if (gameFindQuery.gameSlotFindQuery !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilderResult);

      queryBuilderResult = this.#findByGameSlotFindQuery(
        gamePropertiesPrefix,
        gameFindQuery.gameSlotFindQuery,
        queryBuilderResult as SelectQueryBuilder<GameDb>,
      );
    }

    if (gameFindQuery.state !== undefined) {
      if (gameFindQuery.state.currentPlayingSlotIndex !== undefined) {
        queryBuilderResult = queryBuilderResult.andWhere(
          `${gamePropertiesPrefix}currentPlayingSlotIndex = :${gamePropertiesPrefix}currentPlayingSlotIndex`,
          {
            [`${gamePropertiesPrefix}currentPlayingSlotIndex`]:
              gameFindQuery.state.currentPlayingSlotIndex,
          },
        );
      }
    }

    if (gameFindQuery.status !== undefined) {
      queryBuilderResult = queryBuilderResult.andWhere(
        `${gamePropertiesPrefix}status = :${gamePropertiesPrefix}status`,
        {
          [`${gamePropertiesPrefix}status`]: gameFindQuery.status,
        },
      );
    }

    return queryBuilderResult as T;
  }

  #isPaginatedQuery(gameFindQuery: GameFindQuery): boolean {
    return (
      gameFindQuery.limit !== undefined || gameFindQuery.offset !== undefined
    );
  }
}
