import { Converter } from '@cornie-js/backend-common';
import { FindTypeOrmService } from '@cornie-js/backend-db';
import {
  GameOptions,
  GameOptionsFindQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { GameOptionsDbToGameOptionsTypeOrmConverter } from '../converters/GameOptionsDbToGameOptionsTypeOrmConverter';
import { GameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter } from '../converters/GameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter';
import { GameOptionsDb } from '../models/GameOptionsDb';

@Injectable()
export class FindGameOptionsTypeOrmService extends FindTypeOrmService<
  GameOptions,
  GameOptionsDb,
  GameOptionsFindQuery
> {
  constructor(
    @InjectRepository(GameOptionsDb)
    repository: Repository<GameOptionsDb>,
    @Inject(GameOptionsDbToGameOptionsTypeOrmConverter)
    gameOptionsDbToGameOptionsConverter: Converter<GameOptionsDb, GameOptions>,
    @Inject(GameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter)
    gameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter: Converter<
      GameOptionsFindQuery,
      FindManyOptions<GameOptionsDb>
    >,
  ) {
    super(
      repository,
      gameOptionsDbToGameOptionsConverter,
      gameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter,
    );
  }
}
