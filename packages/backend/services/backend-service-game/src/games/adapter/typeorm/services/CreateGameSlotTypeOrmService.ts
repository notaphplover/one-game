import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Converter } from '@one-game-js/backend-common';
import { InsertTypeOrmPostgresService } from '@one-game-js/backend-db';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { NonStartedGameSlot } from '../../../domain/models/NonStartedGameSlot';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameCreateQueryToGameSlotCreateQueryTypeOrmConverter } from '../converters/GameCreateQueryToGameSlotCreateQueryTypeOrmConverter';
import { GameSlotDbToGameSlotConverter } from '../converters/GameSlotDbToGameSlotConverter';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class CreateGameSlotTypeOrmService extends InsertTypeOrmPostgresService<
  NonStartedGameSlot,
  GameSlotDb,
  GameCreateQuery
> {
  constructor(
    @InjectRepository(GameSlotDb)
    repository: Repository<GameSlotDb>,
    @Inject(GameSlotDbToGameSlotConverter)
    gameSlotDbToGameSlotConverter: Converter<GameSlotDb, NonStartedGameSlot>,
    @Inject(GameCreateQueryToGameSlotCreateQueryTypeOrmConverter)
    gameCreateQueryToGameSlotCreateQueryTypeOrmConverter: Converter<
      GameCreateQuery,
      QueryDeepPartialEntity<GameSlotDb>
    >,
  ) {
    super(
      repository,
      gameSlotDbToGameSlotConverter,
      gameCreateQueryToGameSlotCreateQueryTypeOrmConverter,
    );
  }
}
