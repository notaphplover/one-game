import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import {
  GameActionCreateQuery,
  GameActionKind,
} from '@cornie-js/backend-game-domain/gameActions';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InsertQueryBuilder,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { CardDbBuilder } from '../../../../cards/adapter/typeorm/builders/CardDbBuilder';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameActionDb } from '../models/GameActionDb';
import { GameActionDbPayload } from '../models/GameActionDbPayload';
import { GameActionDbVersion } from '../models/GameActionDbVersion';
import { GameActionDbPayloadV1Kind } from '../models/v1/GameActionDbPayloadV1Kind';

@Injectable()
export class GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder
  implements
    Builder<
      InsertQueryBuilder<GameActionDb>,
      [GameActionCreateQuery, InsertQueryBuilder<GameActionDb>]
    >
{
  readonly #cardDbBuilder: Builder<CardDb, [Card]>;
  readonly #repository: Repository<GameActionDb>;

  constructor(
    @Inject(CardDbBuilder)
    cardDbBuilder: Builder<CardDb, [Card]>,
    @InjectRepository(GameActionDb)
    repository: Repository<GameActionDb>,
  ) {
    this.#cardDbBuilder = cardDbBuilder;
    this.#repository = repository;
  }

  public build(
    gameActionCreateQuery: GameActionCreateQuery,
    insertQueryBuilder: InsertQueryBuilder<GameActionDb>,
  ): InsertQueryBuilder<GameActionDb> {
    const gameActionCreateQueryTypeOrm: QueryDeepPartialEntity<GameActionDb> = {
      currentPlayingSlotIndex: gameActionCreateQuery.currentPlayingSlotIndex,
      game: {
        id: gameActionCreateQuery.gameId,
      },
      id: gameActionCreateQuery.id,
      payload: JSON.stringify(this.#buildPayload(gameActionCreateQuery)),
      position: (): string => this.#buildPositionQuery(),
      turn: gameActionCreateQuery.turn,
    };

    return insertQueryBuilder
      .values(gameActionCreateQueryTypeOrm)
      .setParameters(this.#buildPositionQueryParameters(gameActionCreateQuery));
  }

  #buildPayload(
    gameActionCreateQuery: GameActionCreateQuery,
  ): GameActionDbPayload {
    switch (gameActionCreateQuery.kind) {
      case GameActionKind.draw:
        return {
          draw: gameActionCreateQuery.draw.map((card: Card) =>
            this.#cardDbBuilder.build(card),
          ),
          kind: GameActionDbPayloadV1Kind.draw,
          version: GameActionDbVersion.v1,
        };
      case GameActionKind.passTurn:
        return {
          kind: GameActionDbPayloadV1Kind.passTurn,
          version: GameActionDbVersion.v1,
        };
      case GameActionKind.playCards:
        return {
          cards: gameActionCreateQuery.cards.map((card: Card) =>
            this.#cardDbBuilder.build(card),
          ),
          kind: GameActionDbPayloadV1Kind.playCards,
          version: GameActionDbVersion.v1,
        };
    }
  }

  #buildPositionQuery(): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const positionQueryBuilder: SelectQueryBuilder<GameActionDb> =
      this.#repository
        .createQueryBuilder(GameActionDb.name)
        .subQuery()
        .from(GameActionDb, GameActionDb.name)
        .select([
          `COALESCE(MAX(${GameActionDb.name}.position) + 1, 0) as position`,
        ])
        .where(`${GameActionDb.name}.game = :${GameActionDb.name}.game`);

    return positionQueryBuilder.getQuery();
  }

  #buildPositionQueryParameters(
    gameActionCreateQuery: GameActionCreateQuery,
  ): ObjectLiteral {
    return {
      [`${GameActionDb.name}.game`]: gameActionCreateQuery.gameId,
    };
  }
}
