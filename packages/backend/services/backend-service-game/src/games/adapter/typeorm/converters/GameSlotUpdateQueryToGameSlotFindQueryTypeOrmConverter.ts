import { Converter } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

import { GameSlotFindQuery } from '../../../domain/query/GameSlotFindQuery';
import { GameSlotUpdateQuery } from '../../../domain/query/GameSlotUpdateQuery';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter } from './GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter';

@Injectable()
export class GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter
  implements Converter<GameSlotUpdateQuery, FindManyOptions<GameSlotDb>>
{
  readonly #gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter: Converter<
    GameSlotFindQuery,
    FindManyOptions<GameSlotDb>
  >;

  constructor(
    @Inject(GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter)
    gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter: Converter<
      GameSlotFindQuery,
      FindManyOptions<GameSlotDb>
    >,
  ) {
    this.#gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter =
      gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter;
  }

  public convert(
    gameSlotUpdateQuery: GameSlotUpdateQuery,
  ): FindManyOptions<GameSlotDb> {
    return this.#gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter.convert(
      gameSlotUpdateQuery.gameSlotFindQuery,
    );
  }
}
