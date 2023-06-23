import { Converter } from '@cornie-js/backend-common';
import { InsertTypeOrmPostgresService } from '@cornie-js/backend-db';
import {
  GameOptions,
  GameOptionsCreateQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameOptionsCreateQueryToGameOptionsCreateQueryTypeOrmConverter } from '../converters/GameOptionsCreateQueryToGameOptionsCreateQueryTypeOrmConverter';
import { GameOptionsDbToGameOptionsTypeOrmConverter } from '../converters/GameOptionsDbToGameOptionsTypeOrmConverter';
import { GameOptionsDb } from '../models/GameOptionsDb';

@Injectable()
export class CreateGameOptionsTypeOrmService extends InsertTypeOrmPostgresService<
  GameOptions,
  GameOptionsDb,
  GameOptionsCreateQuery
> {
  constructor(
    @InjectRepository(GameOptionsDb)
    repository: Repository<GameOptionsDb>,
    @Inject(GameOptionsDbToGameOptionsTypeOrmConverter)
    gameOptionsDbToGameOptionsConverter: Converter<GameOptionsDb, GameOptions>,
    @Inject(GameOptionsCreateQueryToGameOptionsCreateQueryTypeOrmConverter)
    gameOptionsCreateQueryToGameOptionsCreateQueryTypeOrmConverter: Converter<
      GameOptionsCreateQuery,
      QueryDeepPartialEntity<GameOptionsDb>
    >,
  ) {
    super(
      repository,
      gameOptionsDbToGameOptionsConverter,
      gameOptionsCreateQueryToGameOptionsCreateQueryTypeOrmConverter,
    );
  }
}
