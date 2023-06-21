import { Converter, Writable } from '@cornie-js/backend-common';
import { GameSlotFindQuery } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

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
      gameFindQueryTypeOrmWhere.game = {
        id: gameSlotFindQuery.gameId,
      };
    }

    if (gameSlotFindQuery.position !== undefined) {
      gameFindQueryTypeOrmWhere.position = gameSlotFindQuery.position;
    }

    return gameFindQueryTypeOrm;
  }
}
