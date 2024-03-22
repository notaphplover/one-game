import { Builder } from '@cornie-js/backend-common';
import { FindTypeOrmQueryBuilderService } from '@cornie-js/backend-db/adapter/typeorm';
import {
  GameAction,
  GameActionFindQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { GameActionFindQueryTypeOrmFromGameActionFindQueryBuilder } from '../builders/GameActionFindQueryTypeOrmFromGameActionFindQueryBuilder';
import { GameActionFromGameActionDbBuilder } from '../builders/GameActionFromGameActionDbBuilder';
import { GameActionDb } from '../models/GameActionDb';

@Injectable()
export class FindGameActionTypeOrmService extends FindTypeOrmQueryBuilderService<
  GameAction,
  GameActionDb,
  GameActionFindQuery
> {
  constructor(
    @InjectRepository(GameActionDb)
    repository: Repository<GameActionDb>,
    @Inject(GameActionFromGameActionDbBuilder)
    gameActionFromGameActionDbBuilder: Builder<GameAction, [GameActionDb]>,
    @Inject(GameActionFindQueryTypeOrmFromGameActionFindQueryBuilder)
    gameActionFindQueryTypeOrmFromGameActionFindQueryBuilder: Builder<
      SelectQueryBuilder<GameActionDb>,
      [GameActionFindQuery, SelectQueryBuilder<GameActionDb>]
    >,
  ) {
    super(
      repository,
      gameActionFromGameActionDbBuilder,
      gameActionFindQueryTypeOrmFromGameActionFindQueryBuilder,
    );
  }
}
