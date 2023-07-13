import { Converter } from '@cornie-js/backend-common';
import {
  GameSlotFindQuery,
  GameSlotUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { ObjectLiteral, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter } from './GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter';

@Injectable()
export class GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter
  implements
    Converter<
      GameSlotUpdateQuery,
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
    @Inject(GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter)
    gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter: Converter<
      GameSlotFindQuery,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
    >,
  ) {
    this.#gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter =
      gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter;
  }

  public convert(
    gameSlotUpdateQuery: GameSlotUpdateQuery,
    queryBuilder: QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
  ): QueryBuilder<ObjectLiteral> & WhereExpressionBuilder {
    return this.#gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter.convert(
      gameSlotUpdateQuery.gameSlotFindQuery,
      queryBuilder,
    );
  }
}
