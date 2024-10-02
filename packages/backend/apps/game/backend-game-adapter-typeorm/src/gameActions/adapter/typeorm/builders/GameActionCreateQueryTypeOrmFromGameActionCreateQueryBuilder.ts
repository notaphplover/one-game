import { Builder } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  GameActionCreateQuery,
  GameActionKind,
  PlayCardsGameActionCreateQueryStateUpdate,
} from '@cornie-js/backend-game-domain/gameActions';
import { GameDirection } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InsertQueryBuilder,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { CardColorDbBuilder } from '../../../../cards/adapter/typeorm/builders/CardColorDbBuilder';
import { CardDbBuilder } from '../../../../cards/adapter/typeorm/builders/CardDbBuilder';
import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameDirectionDbFromGameDirectionBuilder } from '../../../../games/adapter/typeorm/builders/GameDirectionDbFromGameDirectionBuilder';
import { GameDirectionDb } from '../../../../games/adapter/typeorm/models/GameDirectionDb';
import { GameActionDb } from '../models/GameActionDb';
import { GameActionDbPayload } from '../models/GameActionDbPayload';
import { GameActionDbVersion } from '../models/GameActionDbVersion';
import { GameActionDbPayloadV1Kind } from '../models/v1/GameActionDbPayloadV1Kind';
import { PlayCardsGameActionStateUpdateDbPayloadV1 } from '../models/v1/PlayCardsGameActionDbPayloadV1';

@Injectable()
export class GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder
  implements
    Builder<
      InsertQueryBuilder<GameActionDb>,
      [GameActionCreateQuery, InsertQueryBuilder<GameActionDb>]
    >
{
  readonly #cardColorDbBuilder: Builder<CardColorDb, [CardColor]>;
  readonly #cardDbBuilder: Builder<CardDb, [Card]>;
  readonly #gameDirectionDbFromGameDirection: Builder<
    GameDirectionDb,
    [GameDirection]
  >;
  readonly #repository: Repository<GameActionDb>;

  constructor(
    @Inject(CardColorDbBuilder)
    cardColorDbBuilder: Builder<CardColorDb, [CardColor]>,
    @Inject(CardDbBuilder)
    cardDbBuilder: Builder<CardDb, [Card]>,
    @Inject(GameDirectionDbFromGameDirectionBuilder)
    gameDirectionDbFromGameDirection: Builder<GameDirectionDb, [GameDirection]>,
    @InjectRepository(GameActionDb)
    repository: Repository<GameActionDb>,
  ) {
    this.#cardColorDbBuilder = cardColorDbBuilder;
    this.#cardDbBuilder = cardDbBuilder;
    this.#gameDirectionDbFromGameDirection = gameDirectionDbFromGameDirection;
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
          nextPlayingSlotIndex: gameActionCreateQuery.nextPlayingSlotIndex,
          version: GameActionDbVersion.v1,
        };
      case GameActionKind.playCards:
        return {
          cards: gameActionCreateQuery.cards.map((card: Card) =>
            this.#cardDbBuilder.build(card),
          ),
          kind: GameActionDbPayloadV1Kind.playCards,
          stateUpdate: this.#buildStateUpdateDb(
            gameActionCreateQuery.stateUpdate,
          ),
          version: GameActionDbVersion.v1,
        };
    }
  }

  #buildPositionQuery(): string {
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

  #buildStateUpdateDb(
    stateUpdate: PlayCardsGameActionCreateQueryStateUpdate,
  ): PlayCardsGameActionStateUpdateDbPayloadV1 {
    if (stateUpdate.currentCard === null) {
      return {
        currentCard: null,
        currentColor: null,
        currentDirection: null,
        drawCount: null,
      };
    } else {
      return {
        currentCard: this.#cardDbBuilder.build(stateUpdate.currentCard),
        currentColor: this.#cardColorDbBuilder.build(stateUpdate.currentColor),
        currentDirection: this.#gameDirectionDbFromGameDirection.build(
          stateUpdate.currentDirection,
        ),
        drawCount: stateUpdate.drawCount,
      };
    }
  }
}
