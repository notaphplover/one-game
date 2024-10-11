import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  ActiveGameSlot,
  FinishedGame,
  FinishedGameSlot,
  Game,
  GameCardSpec,
  GameDirection,
  GameStatus,
  NonStartedGame,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CardBuilder } from '../../../../cards/adapter/typeorm/builders/CardBuilder';
import { CardColorBuilder } from '../../../../cards/adapter/typeorm/builders/CardColorBuilder';
import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameDb } from '../models/GameDb';
import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameStatusDb } from '../models/GameStatusDb';
import { GameCardSpecArrayFromGameCardSpecArrayDbBuilder } from './GameCardSpecArrayFromGameCardSpecArrayDbBuilder';
import { GameDirectionFromGameDirectionDbBuilder } from './GameDirectionFromGameDirectionDbBuilder';
import { GameSlotFromGameSlotDbBuilder } from './GameSlotFromGameSlotDbBuilder';

@Injectable()
export class GameFromGameDbBuilder implements Builder<Game, [GameDb]> {
  readonly #cardBuilder: Builder<Card, [CardDb]>;
  readonly #cardColorBuilder: Builder<CardColor, [CardColorDb]>;
  readonly #gameCardSpecArrayFromGameCardSpecArrayDbBuilder: Builder<
    GameCardSpec[],
    [string]
  >;
  readonly #gameDirectionFromGameDirectionDbBuilder: Builder<
    GameDirection,
    [GameDirectionDb]
  >;
  readonly #gameSlotFromGameSlotDbBuilder: Builder<
    ActiveGameSlot | FinishedGameSlot | NonStartedGameSlot,
    [GameSlotDb]
  >;

  constructor(
    @Inject(CardBuilder)
    cardBuilder: Builder<Card, [CardDb]>,
    @Inject(CardColorBuilder)
    cardColorBuilder: Builder<CardColor, [CardColorDb]>,
    @Inject(GameCardSpecArrayFromGameCardSpecArrayDbBuilder)
    gameCardSpecArrayFromGameCardSpecArrayDbBuilder: Builder<
      GameCardSpec[],
      [string]
    >,
    @Inject(GameDirectionFromGameDirectionDbBuilder)
    gameDirectionFromGameDirectionDbBuilder: Builder<
      GameDirection,
      [GameDirectionDb]
    >,
    @Inject(GameSlotFromGameSlotDbBuilder)
    gameSlotFromGameSlotDbBuilder: Builder<
      ActiveGameSlot | FinishedGameSlot | NonStartedGameSlot,
      [GameSlotDb]
    >,
  ) {
    this.#cardBuilder = cardBuilder;
    this.#cardColorBuilder = cardColorBuilder;
    this.#gameCardSpecArrayFromGameCardSpecArrayDbBuilder =
      gameCardSpecArrayFromGameCardSpecArrayDbBuilder;
    this.#gameDirectionFromGameDirectionDbBuilder =
      gameDirectionFromGameDirectionDbBuilder;
    this.#gameSlotFromGameSlotDbBuilder = gameSlotFromGameSlotDbBuilder;
  }

  public build(gameDb: GameDb): Game {
    const gameSlots:
      | ActiveGameSlot[]
      | FinishedGameSlot[]
      | NonStartedGameSlot[] = gameDb.gameSlotsDb
      .map((gameSlotDb: GameSlotDb) =>
        this.#gameSlotFromGameSlotDbBuilder.build(gameSlotDb),
      )
      .sort(
        (
          gameSlot1: ActiveGameSlot | NonStartedGameSlot | NonStartedGameSlot,
          gameSlot2: ActiveGameSlot | NonStartedGameSlot | NonStartedGameSlot,
        ) => gameSlot1.position - gameSlot2.position,
      );

    let game: Game;

    switch (gameDb.status) {
      case GameStatusDb.active:
        game = this.#buildActiveGameDb(gameDb, gameSlots as ActiveGameSlot[]);
        break;
      case GameStatusDb.nonStarted:
        game = this.#buildNonStartedGameDb(
          gameDb,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          gameSlots as NonStartedGameSlot[],
        );
        break;
      case GameStatusDb.finished:
        game = this.#buildFinishedGameDb(
          gameDb,
          gameSlots as FinishedGameSlot[],
        );
        break;
    }

    return game;
  }

  #buildActiveGameDb(gameDb: GameDb, gameSlots: ActiveGameSlot[]): ActiveGame {
    if (
      gameDb.currentCard === null ||
      gameDb.currentColor === null ||
      gameDb.currentDirection === null ||
      gameDb.currentPlayingSlotIndex === null ||
      gameDb.currentTurnCardsDrawn === null ||
      gameDb.currentTurnCardsPlayed === null ||
      gameDb.deck === null ||
      gameDb.drawCount === null ||
      gameDb.skipCount === null ||
      gameDb.turn === null ||
      gameDb.turnExpiresAt === null
    ) {
      throw new AppError(AppErrorKind.unknown, 'Unexpected game db entry');
    }

    return {
      id: gameDb.id,
      isPublic: gameDb.isPublic,
      name: gameDb.name,
      state: {
        currentCard: this.#cardBuilder.build(gameDb.currentCard),
        currentColor: this.#cardColorBuilder.build(gameDb.currentColor),
        currentDirection: this.#gameDirectionFromGameDirectionDbBuilder.build(
          gameDb.currentDirection,
        ),
        currentPlayingSlotIndex: gameDb.currentPlayingSlotIndex,
        currentTurnCardsDrawn: gameDb.currentTurnCardsDrawn,
        currentTurnCardsPlayed: gameDb.currentTurnCardsPlayed,
        currentTurnSingleCardDraw:
          gameDb.currentTurnSingleCardDraw === null
            ? undefined
            : this.#cardBuilder.build(gameDb.currentTurnSingleCardDraw),
        deck: this.#gameCardSpecArrayFromGameCardSpecArrayDbBuilder.build(
          gameDb.deck,
        ),
        discardPile:
          this.#gameCardSpecArrayFromGameCardSpecArrayDbBuilder.build(
            gameDb.discardPile,
          ),
        drawCount: gameDb.drawCount,
        lastGameActionId: gameDb.lastGameActionId,
        skipCount: gameDb.skipCount,
        slots: gameSlots,
        status: GameStatus.active,
        turn: gameDb.turn,
        turnExpiresAt: gameDb.turnExpiresAt,
      },
    };
  }

  #buildFinishedGameDb(
    gameDb: GameDb,
    gameSlots: FinishedGameSlot[],
  ): FinishedGame {
    return {
      id: gameDb.id,
      isPublic: gameDb.isPublic,
      name: gameDb.name,
      state: {
        slots: gameSlots,
        status: GameStatus.finished,
      },
    };
  }

  #buildNonStartedGameDb(
    gameDb: GameDb,
    gameSlots: NonStartedGameSlot[],
  ): NonStartedGame {
    return {
      id: gameDb.id,
      isPublic: gameDb.isPublic,
      name: gameDb.name,
      state: {
        slots: gameSlots,
        status: GameStatus.nonStarted,
      },
    };
  }
}
