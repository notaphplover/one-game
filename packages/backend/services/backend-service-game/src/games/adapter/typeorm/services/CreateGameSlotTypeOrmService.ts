import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Converter } from '@one-game-js/backend-common';
import { InsertTypeOrmPostgresService } from '@one-game-js/backend-db';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { ActiveGameSlot } from '../../../domain/models/ActiveGameSlot';
import { NonStartedGameSlot } from '../../../domain/models/NonStartedGameSlot';
import { GameSlotCreateQuery } from '../../../domain/query/GameSlotCreateQuery';
import { GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter } from '../converters/GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter';
import { GameSlotDbToGameSlotConverter } from '../converters/GameSlotDbToGameSlotConverter';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class CreateGameSlotTypeOrmService extends InsertTypeOrmPostgresService<
  ActiveGameSlot | NonStartedGameSlot,
  GameSlotDb,
  GameSlotCreateQuery
> {
  constructor(
    @InjectRepository(GameSlotDb)
    repository: Repository<GameSlotDb>,
    @Inject(GameSlotDbToGameSlotConverter)
    gameSlotDbToGameSlotConverter: Converter<
      GameSlotDb,
      ActiveGameSlot | NonStartedGameSlot
    >,
    @Inject(GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter)
    gameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter: Converter<
      GameSlotCreateQuery,
      QueryDeepPartialEntity<GameSlotDb>
    >,
  ) {
    super(
      repository,
      gameSlotDbToGameSlotConverter,
      gameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter,
    );
  }
}
