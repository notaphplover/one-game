import { Builder } from '@cornie-js/backend-common';
import { GameActionFindQuery } from '@cornie-js/backend-game-domain/gameActions';
import { Injectable } from '@nestjs/common';
import { QueryBuilder, WhereExpressionBuilder } from 'typeorm';

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

    if (gameActionFindQuery.id !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${gameActionPropertiesPrefix}id = :${GameActionDb.name}id`,
        {
          [`${GameActionDb.name}id`]: gameActionFindQuery.id,
        },
      );
    }

    return queryBuilder;
  }
}
