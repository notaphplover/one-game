import { Builder } from '@cornie-js/backend-common';
import { GameSlotFindQuery } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';
import { ObjectLiteral, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { BaseFindQueryToFindQueryTypeOrmBuilder } from '../../../../foundation/db/adapter/typeorm/builders/BaseFindQueryToFindQueryTypeOrmBuilder';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class GameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder
  extends BaseFindQueryToFindQueryTypeOrmBuilder
  implements
    Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [GameSlotFindQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
    >
{
  public build(
    gameSlotFindQuery: GameSlotFindQuery,
    queryBuilder: QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
  ): QueryBuilder<ObjectLiteral> & WhereExpressionBuilder {
    const gameSlotPropertiesPrefix: string = this._getEntityPrefix(
      queryBuilder,
      GameSlotDb,
    );

    if (gameSlotFindQuery.gameId !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${gameSlotPropertiesPrefix}game = :${GameSlotDb.name}gameId`,
        {
          [`${GameSlotDb.name}gameId`]: gameSlotFindQuery.gameId,
        },
      );
    }

    if (gameSlotFindQuery.position !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${gameSlotPropertiesPrefix}position = :${GameSlotDb.name}position`,
        {
          [`${GameSlotDb.name}position`]: gameSlotFindQuery.position,
        },
      );
    }

    if (gameSlotFindQuery.userId !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${gameSlotPropertiesPrefix}userId = :${GameSlotDb.name}userId`,
        {
          [`${GameSlotDb.name}userId`]: gameSlotFindQuery.userId,
        },
      );
    }

    return queryBuilder;
  }
}
