import { Builder } from '@cornie-js/backend-common';
import { InsertTypeOrmPostgresServiceV2 } from '@cornie-js/backend-db';
import { Game, GameCreateQuery } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameCreateQueryTypeOrmFromGameCreateQueryBuilder } from '../builders/GameCreateQueryTypeOrmFromGameCreateQueryBuilder';
import { GameFromGameDbBuilder } from '../builders/GameFromGameDbBuilder';
import { GameDb } from '../models/GameDb';

@Injectable()
export class CreateGameTypeOrmService extends InsertTypeOrmPostgresServiceV2<
  Game,
  GameDb,
  GameCreateQuery
> {
  constructor(
    @InjectRepository(GameDb)
    repository: Repository<GameDb>,
    @Inject(GameFromGameDbBuilder)
    gameFromGameDbBuilder: Builder<Game, [GameDb]>,
    @Inject(GameCreateQueryTypeOrmFromGameCreateQueryBuilder)
    gameCreateQueryTypeOrmFromGameCreateQueryBuilder: Builder<
      QueryDeepPartialEntity<GameDb>,
      [GameCreateQuery]
    >,
  ) {
    super(
      repository,
      gameFromGameDbBuilder,
      gameCreateQueryTypeOrmFromGameCreateQueryBuilder,
    );
  }
}
