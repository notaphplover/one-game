import { Builder } from '@cornie-js/backend-common';
import { InsertTypeOrmPostgresService } from '@cornie-js/backend-db/adapter/typeorm';
import {
  GameSpec,
  GameSpecCreateQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder } from '../builders/GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder';
import { GameSpecFromGameSpecDbBuilder } from '../builders/GameSpecFromGameSpecDbBuilder';
import { GameSpecDb } from '../models/GameSpecDb';

@Injectable()
export class CreateGameSpecTypeOrmService extends InsertTypeOrmPostgresService<
  GameSpec,
  GameSpecDb,
  GameSpecCreateQuery
> {
  constructor(
    @InjectRepository(GameSpecDb)
    repository: Repository<GameSpecDb>,
    @Inject(GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder)
    gameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder: Builder<
      DeepPartial<GameSpecDb>,
      [GameSpecCreateQuery]
    >,
    @Inject(GameSpecFromGameSpecDbBuilder)
    gameSpecFromGameSpecDbBuilder: Builder<GameSpec, [GameSpecDb]>,
  ) {
    super(
      repository,
      gameSpecFromGameSpecDbBuilder,
      gameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder,
    );
  }
}
