import {
  Game,
  GameFindQuery,
} from '@cornie-js/backend-app-game-domain/games/domain';
import { Converter } from '@cornie-js/backend-common';
import { FindTypeOrmService } from '@cornie-js/backend-db';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { GameDbToGameConverter } from '../converters/GameDbToGameConverter';
import { GameFindQueryToGameFindQueryTypeOrmConverter } from '../converters/GameFindQueryToGameFindQueryTypeOrmConverter';
import { GameDb } from '../models/GameDb';

@Injectable()
export class FindGameTypeOrmService extends FindTypeOrmService<
  Game,
  GameDb,
  GameFindQuery
> {
  constructor(
    @InjectRepository(GameDb)
    repository: Repository<GameDb>,
    @Inject(GameDbToGameConverter)
    gameDbToGameConverter: Converter<GameDb, Game>,
    @Inject(GameFindQueryToGameFindQueryTypeOrmConverter)
    gameFindQueryToGameFindQueryTypeOrmConverter: Converter<
      GameFindQuery,
      FindManyOptions<GameDb>
    >,
  ) {
    super(
      repository,
      gameDbToGameConverter,
      gameFindQueryToGameFindQueryTypeOrmConverter,
    );
  }
}
