import { Builder } from '@cornie-js/backend-common';
import { GameSpecFindQuery } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';
import { ObjectLiteral, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

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

    if (gameSpecFindQuery.gameId !== undefined) {
      queryBuilder.andWhere(
        `${gameSpecPropertiesPrefix}game = :${GameSpecDb.name}game`,
        {
          [`${GameSpecDb.name}game`]: gameSpecFindQuery.gameId,
        },
      );
    }

    return queryBuilder;
  }
}
