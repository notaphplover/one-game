import { Converter, Writable } from '@cornie-js/backend-common';
import { GameOptionsFindQuery } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

import { GameOptionsDb } from '../models/GameOptionsDb';

@Injectable()
export class GameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter
  implements Converter<GameOptionsFindQuery, FindManyOptions<GameOptionsDb>>
{
  public convert(
    gameOptionsFindQuery: GameOptionsFindQuery,
  ): FindManyOptions<GameOptionsDb> {
    const gameOptionsfindQueryTypeOrmwhere: Writable<
      FindOptionsWhere<GameOptionsDb>
    > = {};

    if (gameOptionsFindQuery.gameId !== undefined) {
      gameOptionsfindQueryTypeOrmwhere.game = {
        id: gameOptionsFindQuery.gameId,
      };
    }

    return {
      where: gameOptionsfindQueryTypeOrmwhere,
    };
  }
}
