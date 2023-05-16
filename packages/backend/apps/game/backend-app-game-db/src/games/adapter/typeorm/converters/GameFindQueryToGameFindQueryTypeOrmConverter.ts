import { GameFindQuery } from '@cornie-js/backend-app-game-models/games/domain';
import { Converter, Writable } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

import { GameDb } from '../models/GameDb';

@Injectable()
export class GameFindQueryToGameFindQueryTypeOrmConverter
  implements Converter<GameFindQuery, FindManyOptions<GameDb>>
{
  public convert(gameFindQuery: GameFindQuery): FindManyOptions<GameDb> {
    const findOptions: Writable<FindOptionsWhere<GameDb>> = {};

    if (gameFindQuery.id !== undefined) {
      findOptions.id = gameFindQuery.id;
    }

    return {
      where: findOptions,
    };
  }
}
