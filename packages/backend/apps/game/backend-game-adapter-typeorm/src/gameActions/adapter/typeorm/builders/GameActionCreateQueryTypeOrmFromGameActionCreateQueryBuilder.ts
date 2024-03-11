import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import {
  GameActionCreateQuery,
  GameActionKind,
} from '@cornie-js/backend-game-domain/gameActions';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm';
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
    Builder<QueryDeepPartialEntity<GameActionDb>, [GameActionCreateQuery]>
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
  ): QueryDeepPartialEntity<GameActionDb> {
    return {
      currentPlayingSlotIndex: gameActionCreateQuery.currentPlayingSlotIndex,
      game: {
        id: gameActionCreateQuery.gameId,
      },
      id: gameActionCreateQuery.id,
      payload: JSON.stringify(this.#buildPayload(gameActionCreateQuery)),
      position: (): string => this.#buildPositionQuery(gameActionCreateQuery),
      turn: gameActionCreateQuery.turn,
    };
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

  #buildPositionQuery(gameActionCreateQuery: GameActionCreateQuery): string {
    const findOptions: FindOptionsWhere<GameActionDb> = {
      game: {
        id: gameActionCreateQuery.gameId,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const positionQueryBuilder: SelectQueryBuilder<GameActionDb> =
      this.#repository
        .createQueryBuilder(GameActionDb.name)
        .subQuery()
        .select([
          `COALESCE(MAX(${GameActionDb.name}.position) + 1, 0) as position`,
        ])
        .where(findOptions);

    return positionQueryBuilder.getQuery();
  }
}
