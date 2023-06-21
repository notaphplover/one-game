import { Converter } from '@cornie-js/backend-common';
import { InsertTypeOrmPostgresService } from '@cornie-js/backend-db';
import { Game, GameCreateQuery } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameCreateQueryToGameCreateQueryTypeOrmConverter } from '../converters/GameCreateQueryToGameCreateQueryTypeOrmConverter';
import { GameDbToGameConverter } from '../converters/GameDbToGameConverter';
import { GameDb } from '../models/GameDb';

@Injectable()
export class CreateGameTypeOrmService extends InsertTypeOrmPostgresService<
  Game,
  GameDb,
  GameCreateQuery
> {
  constructor(
    @InjectRepository(GameDb)
    repository: Repository<GameDb>,
    @Inject(GameDbToGameConverter)
    gameDbToGameConverter: Converter<GameDb, Game>,
    @Inject(GameCreateQueryToGameCreateQueryTypeOrmConverter)
    gameCreateQueryToGameCreateQueryTypeOrmConverter: Converter<
      GameCreateQuery,
      QueryDeepPartialEntity<GameDb>
    >,
  ) {
    super(
      repository,
      gameDbToGameConverter,
      gameCreateQueryToGameCreateQueryTypeOrmConverter,
    );
  }
}
