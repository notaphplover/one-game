import { Converter } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

import { Writable } from '../../../../foundation/common/application/models/Writable';
import { GameSlotFindQuery } from '../../../domain/query/GameSlotFindQuery';
import { GameDb } from '../models/GameDb';

@Injectable()
export class GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter
  implements Converter<GameSlotFindQuery, FindManyOptions<GameDb>>
{
  public convert(
    gameSlotFindQuery: GameSlotFindQuery,
  ): FindManyOptions<GameDb> {
    const gameFindQueryTypeOrmWhere: Writable<FindOptionsWhere<GameDb>> = {};

    const gameFindQueryTypeOrm: FindManyOptions<GameDb> = {
      where: gameFindQueryTypeOrmWhere,
    };

    if (gameSlotFindQuery.id !== undefined) {
      gameFindQueryTypeOrmWhere.id = gameSlotFindQuery.id;
    }

    return gameFindQueryTypeOrm;
  }
}
