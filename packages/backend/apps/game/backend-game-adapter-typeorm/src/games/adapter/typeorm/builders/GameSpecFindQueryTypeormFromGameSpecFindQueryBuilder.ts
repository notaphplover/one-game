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
            `${gameSpecPropertiesPrefix}game IN (:${GameSpecDb.name}games)`,
            {
              [`${GameSpecDb.name}games`]: gameSpecFindQuery.gameIds,
            },
          );
        }
      }
    }

    return queryBuilder;
  }

  #isArrayWithOneElement<T>(array: T[]): array is [T] {
    return array.length === 1;
  }
}
