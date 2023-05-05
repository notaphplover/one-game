import { Converter } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

import { GameFindQuery } from '../../../domain/query/GameFindQuery';
import { GameUpdateQuery } from '../../../domain/query/GameUpdateQuery';
import { GameDb } from '../models/GameDb';
import { GameFindQueryToGameFindQueryTypeOrmConverter } from './GameFindQueryToGameFindQueryTypeOrmConverter';

@Injectable()
export class GameUpdateQueryToGameFindQueryTypeOrmConverter
  implements Converter<GameUpdateQuery, FindManyOptions<GameDb>>
{
  readonly #gameFindQueryToGameFindQueryTypeOrmConverter: Converter<
    GameFindQuery,
    FindManyOptions<GameDb>
  >;

  constructor(
    @Inject(GameFindQueryToGameFindQueryTypeOrmConverter)
    gameFindQueryToGameFindQueryTypeOrmConverter: Converter<
      GameFindQuery,
      FindManyOptions<GameDb>
    >,
  ) {
    this.#gameFindQueryToGameFindQueryTypeOrmConverter =
      gameFindQueryToGameFindQueryTypeOrmConverter;
  }

  public convert(gameUpdateQuery: GameUpdateQuery): FindManyOptions<GameDb> {
    return this.#gameFindQueryToGameFindQueryTypeOrmConverter.convert(
      gameUpdateQuery.gameFindQuery,
    );
  }
}
