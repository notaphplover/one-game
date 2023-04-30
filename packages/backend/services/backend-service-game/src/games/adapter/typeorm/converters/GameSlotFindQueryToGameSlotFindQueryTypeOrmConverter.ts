import { Converter } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

import { Writable } from '../../../../foundation/common/application/models/Writable';
import { GameSlotFindQuery } from '../../../domain/query/GameSlotFindQuery';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter
  implements Converter<GameSlotFindQuery, FindManyOptions<GameSlotDb>>
{
  public convert(
    gameSlotFindQuery: GameSlotFindQuery,
  ): FindManyOptions<GameSlotDb> {
    const gameFindQueryTypeOrmWhere: Writable<FindOptionsWhere<GameSlotDb>> =
      {};

    const gameFindQueryTypeOrm: FindManyOptions<GameSlotDb> = {
      where: gameFindQueryTypeOrmWhere,
    };

    if (gameSlotFindQuery.gameId !== undefined) {
      gameFindQueryTypeOrmWhere.gameId = gameSlotFindQuery.gameId;
    }

    if (gameSlotFindQuery.position !== undefined) {
      gameFindQueryTypeOrmWhere.position = gameSlotFindQuery.position;
    }

    return gameFindQueryTypeOrm;
  }
}
