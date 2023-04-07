import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppError, AppErrorKind, Converter } from '@one-game-js/backend-common';
import {
  InsertTypeOrmPostgresService,
  InsertTypeOrmService,
} from '@one-game-js/backend-db';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { Writable } from '../../../../foundation/common/application/models/Writable';
import { ActiveGameSlot } from '../../../domain/models/ActiveGameSlot';
import { Game } from '../../../domain/models/Game';
import { NonStartedGameSlot } from '../../../domain/models/NonStartedGameSlot';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameCreateQueryToGameCreateQueryTypeOrmConverter } from '../converters/GameCreateQueryToGameCreateQueryTypeOrmConverter';
import { GameDbToGameConverter } from '../converters/GameDbToGameConverter';
import { GameDb } from '../models/GameDb';
import { GameSlotDb } from '../models/GameSlotDb';
import { CreateGameSlotTypeOrmService } from './CreateGameSlotTypeOrmService';

@Injectable()
export class CreateGameTypeOrmService extends InsertTypeOrmPostgresService<
  Game,
  GameDb,
  GameCreateQuery
> {
  readonly #createGameSlotTypeOrmService: InsertTypeOrmService<
    NonStartedGameSlot | ActiveGameSlot,
    GameSlotDb,
    GameCreateQuery
  >;

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
    @Inject(CreateGameSlotTypeOrmService)
    createGameSlotTypeOrmService: InsertTypeOrmService<
      NonStartedGameSlot | ActiveGameSlot,
      GameSlotDb,
      GameCreateQuery
    >,
  ) {
    super(
      repository,
      gameDbToGameConverter,
      gameCreateQueryToGameCreateQueryTypeOrmConverter,
    );

    this.#createGameSlotTypeOrmService = createGameSlotTypeOrmService;
  }

  public override async insertOne(
    gameCreateQuery: GameCreateQuery,
  ): Promise<Game> {
    const game: Game = await super.insertOne(gameCreateQuery);

    const gameSlots: (NonStartedGameSlot | ActiveGameSlot)[] =
      await this.#createGameSlotTypeOrmService.insertMany(gameCreateQuery);

    (game as Writable<Game>).slots = gameSlots;

    return game;
  }

  public override async insertMany(): Promise<Game[]> {
    throw new AppError(AppErrorKind.unknown, 'Method not implemented');
  }
}
