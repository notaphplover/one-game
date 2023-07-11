import { Converter } from '@cornie-js/backend-common';
import { GameFindQuery } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';
import { InstanceChecker, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { BaseFindQueryToFindQueryTypeOrmConverter } from '../../../../foundation/db/adapter/typeorm/converters/BaseFindQueryToFindQueryTypeOrmConverter';
import { GameDb } from '../models/GameDb';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class GameFindQueryToGameFindQueryTypeOrmConverter
  extends BaseFindQueryToFindQueryTypeOrmConverter
  implements
    Converter<
      GameFindQuery,
      QueryBuilder<GameDb> & WhereExpressionBuilder,
      QueryBuilder<GameDb> & WhereExpressionBuilder
    >
{
  public convert(
    gameFindQuery: GameFindQuery,
    queryBuilder: QueryBuilder<GameDb> & WhereExpressionBuilder,
  ): QueryBuilder<GameDb> & WhereExpressionBuilder {
    const gamePropertiesPrefix: string = this._getEntityPrefix(
      queryBuilder,
      GameDb,
    );

    if (InstanceChecker.isSelectQueryBuilder(queryBuilder)) {
      queryBuilder = queryBuilder.leftJoinAndSelect(
        `${gamePropertiesPrefix}gameSlotsDb`,
        GameSlotDb.name,
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

    return queryBuilder;
  }
}
