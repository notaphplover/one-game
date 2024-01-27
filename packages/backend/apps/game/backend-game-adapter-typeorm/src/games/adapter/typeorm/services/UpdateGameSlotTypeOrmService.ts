import { Builder } from '@cornie-js/backend-common';
import { UpdateTypeOrmService } from '@cornie-js/backend-db/adapter/typeorm';
import { GameSlotUpdateQuery } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ObjectLiteral,
  QueryBuilder,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder } from '../builders/GameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder';
import { GameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder } from '../builders/GameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class UpdateGameSlotTypeOrmService extends UpdateTypeOrmService<
  GameSlotDb,
  GameSlotUpdateQuery
> {
  constructor(
    @InjectRepository(GameSlotDb)
    repository: Repository<GameSlotDb>,
    @Inject(GameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder)
    gameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder: Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [
        GameSlotUpdateQuery,
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      ]
    >,
    @Inject(GameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder)
    gameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder: Builder<
      QueryDeepPartialEntity<GameSlotDb>,
      [GameSlotUpdateQuery]
    >,
  ) {
    super(
      repository,
      gameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder,
      gameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder,
    );
  }
}
