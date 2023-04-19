import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Converter } from '@one-game-js/backend-common';
import { FindTypeOrmService } from '@one-game-js/backend-db';
import { FindManyOptions, Repository } from 'typeorm';

import { Game } from '../../../domain/models/Game';
import { GameFindQuery } from '../../../domain/query/GameFindQuery';
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
