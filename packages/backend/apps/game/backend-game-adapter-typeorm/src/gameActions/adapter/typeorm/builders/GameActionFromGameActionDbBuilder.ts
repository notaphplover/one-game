import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import {
  GameAction,
  GameActionKind,
} from '@cornie-js/backend-game-domain/gameActions';
import { Inject, Injectable } from '@nestjs/common';

import { CardBuilder } from '../../../../cards/adapter/typeorm/builders/CardBuilder';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameActionDb } from '../models/GameActionDb';
import { GameActionDbPayload } from '../models/GameActionDbPayload';
import { GameActionDbVersion } from '../models/GameActionDbVersion';
import { GameActionDbPayloadV1 } from '../models/v1/GameActionDbPayloadV1';
import { GameActionDbPayloadV1Kind } from '../models/v1/GameActionDbPayloadV1Kind';

@Injectable()
export class GameActionFromGameActionDbBuilder
  implements Builder<GameAction, [GameActionDb]>
{
  readonly #cardBuilder: Builder<Card, [CardDb]>;

  constructor(
    @Inject(CardBuilder)
    cardBuilder: Builder<Card, [CardDb]>,
  ) {
    this.#cardBuilder = cardBuilder;
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
          currentCard:
            payload.currentCard === null
              ? null
              : this.#cardBuilder.build(payload.currentCard),
          currentPlayingSlotIndex: gameActionDb.currentPlayingSlotIndex,
          gameId: gameActionDb.gameId,
          id: gameActionDb.id,
          kind: GameActionKind.playCards,
          position: gameActionDb.position,
          turn: gameActionDb.turn,
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
