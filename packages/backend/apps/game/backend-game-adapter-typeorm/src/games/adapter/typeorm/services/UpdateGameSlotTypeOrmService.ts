import { Converter } from '@cornie-js/backend-common';
import { UpdateTypeOrmService } from '@cornie-js/backend-db';
import { GameSlotUpdateQuery } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository, WhereExpressionBuilder } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter } from '../converters/GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter';
import { GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter } from '../converters/GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class UpdateGameSlotTypeOrmService extends UpdateTypeOrmService<
  GameSlotDb,
  GameSlotUpdateQuery
> {
  constructor(
    @InjectRepository(GameSlotDb)
    repository: Repository<GameSlotDb>,
    @Inject(GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter)
    gameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter: Converter<
      GameSlotUpdateQuery,
      QueryBuilder<GameSlotDb> & WhereExpressionBuilder,
      QueryBuilder<GameSlotDb> & WhereExpressionBuilder
    >,
    @Inject(GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter)
    gameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter: Converter<
      GameSlotUpdateQuery,
      QueryDeepPartialEntity<GameSlotDb>
    >,
  ) {
    super(
      repository,
      gameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter,
      gameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter,
    );
  }
}
