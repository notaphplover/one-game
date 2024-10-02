import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  GameAction,
  GameActionKind,
  PlayCardsGameActionStateUpdate,
} from '@cornie-js/backend-game-domain/gameActions';
import { GameDirection } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CardBuilder } from '../../../../cards/adapter/typeorm/builders/CardBuilder';
import { CardColorBuilder } from '../../../../cards/adapter/typeorm/builders/CardColorBuilder';
import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameDirectionFromGameDirectionDbBuilder } from '../../../../games/adapter/typeorm/builders/GameDirectionFromGameDirectionDbBuilder';
import { GameDirectionDb } from '../../../../games/adapter/typeorm/models/GameDirectionDb';
import { GameActionDb } from '../models/GameActionDb';
import { GameActionDbPayload } from '../models/GameActionDbPayload';
import { GameActionDbVersion } from '../models/GameActionDbVersion';
import { GameActionDbPayloadV1 } from '../models/v1/GameActionDbPayloadV1';
import { GameActionDbPayloadV1Kind } from '../models/v1/GameActionDbPayloadV1Kind';
import { PlayCardsGameActionStateUpdateDbPayloadV1 } from '../models/v1/PlayCardsGameActionDbPayloadV1';

@Injectable()
export class GameActionFromGameActionDbBuilder
  implements Builder<GameAction, [GameActionDb]>
{
  readonly #cardBuilder: Builder<Card, [CardDb]>;
  readonly #cardColorBuilder: Builder<CardColor, [CardColorDb]>;
  readonly #gameDirectionFromGameDirectionDbBuilder: Builder<
    GameDirection,
    [GameDirectionDb]
  >;

  constructor(
    @Inject(CardBuilder)
    cardBuilder: Builder<Card, [CardDb]>,
    @Inject(CardColorBuilder)
    cardColorBuilder: Builder<CardColor, [CardColorDb]>,
    @Inject(GameDirectionFromGameDirectionDbBuilder)
    gameDirectionFromGameDirectionDbBuilder: Builder<
      GameDirection,
      [GameDirectionDb]
    >,
  ) {
    this.#cardBuilder = cardBuilder;
    this.#cardColorBuilder = cardColorBuilder;
    this.#gameDirectionFromGameDirectionDbBuilder =
      gameDirectionFromGameDirectionDbBuilder;
  }

  public build(gameActionDb: GameActionDb): GameAction {
    const payload: GameActionDbPayload = this.#parsePayload(
      gameActionDb.payload,
    );

    switch (payload.version) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      case GameActionDbVersion.v1:
        return this.#buildFromV1(gameActionDb, payload);
    }
  }

  #buildFromV1(
    gameActionDb: GameActionDb,
    payload: GameActionDbPayloadV1,
  ): GameAction {
    switch (payload.kind) {
      case GameActionDbPayloadV1Kind.draw:
        return {
          currentPlayingSlotIndex: gameActionDb.currentPlayingSlotIndex,
          draw: payload.draw.map((cardDb: CardDb) =>
            this.#cardBuilder.build(cardDb),
          ),
          gameId: gameActionDb.gameId,
          id: gameActionDb.id,
          kind: GameActionKind.draw,
          position: gameActionDb.position,
          turn: gameActionDb.turn,
        };
      case GameActionDbPayloadV1Kind.passTurn:
        return {
          currentPlayingSlotIndex: gameActionDb.currentPlayingSlotIndex,
          gameId: gameActionDb.gameId,
          id: gameActionDb.id,
          kind: GameActionKind.passTurn,
          nextPlayingSlotIndex: payload.nextPlayingSlotIndex,
          position: gameActionDb.position,
          turn: gameActionDb.turn,
        };
      case GameActionDbPayloadV1Kind.playCards:
        return {
          cards: payload.cards.map((cardDb: CardDb) =>
            this.#cardBuilder.build(cardDb),
          ),
          currentPlayingSlotIndex: gameActionDb.currentPlayingSlotIndex,
          gameId: gameActionDb.gameId,
          id: gameActionDb.id,
          kind: GameActionKind.playCards,
          position: gameActionDb.position,
          stateUpdate: this.#buildStateUpdate(payload.stateUpdate),
          turn: gameActionDb.turn,
        };
    }
  }

  #buildStateUpdate(
    stateUpdate: PlayCardsGameActionStateUpdateDbPayloadV1,
  ): PlayCardsGameActionStateUpdate {
    if (stateUpdate.currentCard === null) {
      return {
        currentCard: null,
        currentColor: null,
        currentDirection: null,
        drawCount: null,
      };
    } else {
      return {
        currentCard: this.#cardBuilder.build(stateUpdate.currentCard),
        currentColor: this.#cardColorBuilder.build(stateUpdate.currentColor),
        currentDirection: this.#gameDirectionFromGameDirectionDbBuilder.build(
          stateUpdate.currentDirection,
        ),
        drawCount: stateUpdate.drawCount,
      };
    }
  }

  #parsePayload(payload: string): GameActionDbPayload {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payloadObject: Record<string, unknown> = JSON.parse(payload);

    switch ((payloadObject as Partial<GameActionDbPayload>).version) {
      case GameActionDbVersion.v1:
        return this.#parsePayloadV1(payloadObject);
      default:
        throw new AppError(
          AppErrorKind.unknown,
          'Unexpected game action db payload with wrong version',
        );
    }
  }

  #parsePayloadV1(
    payloadObject: Record<string, unknown>,
  ): GameActionDbPayloadV1 {
    const kind: GameActionDbPayloadV1Kind | undefined = (
      payloadObject as Partial<GameActionDbPayloadV1>
    ).kind;

    if (
      kind === undefined ||
      !Object.values(GameActionDbPayloadV1Kind).includes(kind)
    ) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected game action db v1 payload with wrong kind',
      );
    }

    return payloadObject as unknown as GameActionDbPayloadV1;
  }
}
