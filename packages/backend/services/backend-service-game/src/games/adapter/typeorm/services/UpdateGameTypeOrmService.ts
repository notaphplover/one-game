import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Converter } from '@one-game-js/backend-common';
import { UpdateTypeOrmService } from '@one-game-js/backend-db';
import { FindManyOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameUpdateQuery } from '../../../domain/query/GameUpdateQuery';
import { GameUpdateQueryToGameFindQueryTypeOrmConverter } from '../converters/GameUpdateQueryToGameFindQueryTypeOrmConverter';
import { GameUpdateQueryToGameSetQueryTypeOrmConverter } from '../converters/GameUpdateQueryToGameSetQueryTypeOrmConverter';
import { GameDb } from '../models/GameDb';

@Injectable()
export class UpdateGameTypeOrmService extends UpdateTypeOrmService<
  GameDb,
  GameUpdateQuery
> {
  constructor(
    @InjectRepository(GameDb)
    repository: Repository<GameDb>,
    @Inject(GameUpdateQueryToGameFindQueryTypeOrmConverter)
    gameUpdateQueryToGameFindQueryTypeOrmConverter: Converter<
      GameUpdateQuery,
      FindManyOptions<GameDb>
    >,
    @Inject(GameUpdateQueryToGameSetQueryTypeOrmConverter)
    gameUpdateQueryToGameSetQueryTypeOrmConverter: Converter<
      GameUpdateQuery,
      QueryDeepPartialEntity<GameDb>
    >,
  ) {
    super(
      repository,
      gameUpdateQueryToGameFindQueryTypeOrmConverter,
      gameUpdateQueryToGameSetQueryTypeOrmConverter,
    );
  }
}
