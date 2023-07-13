import { Converter } from '@cornie-js/backend-common';
import {
  GameFindQuery,
  GameSlotFindQuery,
} from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';
import {
  InstanceChecker,
  ObjectLiteral,
  QueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { BaseFindQueryToFindQueryTypeOrmConverter } from '../../../../foundation/db/adapter/typeorm/converters/BaseFindQueryToFindQueryTypeOrmConverter';
import { GameDb } from '../models/GameDb';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class GameFindQueryToGameFindQueryTypeOrmConverter
  extends BaseFindQueryToFindQueryTypeOrmConverter
  implements
    Converter<
      GameFindQuery,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
    >
{
  readonly #gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter: Converter<
    GameSlotFindQuery,
    QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
    QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
  >;

  constructor(
    gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter: Converter<
      GameSlotFindQuery,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
    >,
  ) {
    super();

    this.#gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter =
      gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter;
  }

  public convert(
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
        GameSlotDb.name,
      );

      if (gameFindQuery.gameSlotFindQuery !== undefined) {
        queryBuilder =
          this.#gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter.convert(
            gameFindQuery.gameSlotFindQuery,
            queryBuilder,
          );
      }
    }

    if (gameFindQuery.id !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${gamePropertiesPrefix}id = :${GameDb.name}id`,
        {
          [`${GameDb.name}id`]: gameFindQuery.id,
        },
      );
    }

    return queryBuilder;
  }
}
