import {
  ActiveGameSlot,
  GameSlotCreateQuery,
  NonStartedGameSlot,
} from '@cornie-js/backend-app-game-models/games/domain';
import { Converter } from '@cornie-js/backend-common';
import { InsertTypeOrmPostgresService } from '@cornie-js/backend-db';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

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
