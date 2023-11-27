import {
  AppError,
  AppErrorKind,
  Builder,
  Converter,
} from '@cornie-js/backend-common';
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
import { GameCardSpecDb } from '../models/GameCardSpecDb';
import { GameDb } from '../models/GameDb';
import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameStatusDb } from '../models/GameStatusDb';
import { GameDirectionDbToGameDirectionConverter } from './GameDirectionDbToGameDirectionConverter';
import { GameSlotDbToGameSlotConverter } from './GameSlotDbToGameSlotConverter';

@Injectable()
export class GameDbToGameConverter implements Converter<GameDb, Game> {
  readonly #cardBuilder: Builder<Card, [CardDb]>;
  readonly #cardColorBuilder: Builder<CardColor, [CardColorDb]>;
  readonly #gameDirectionDbToGameDirectionConverter: Converter<
    GameDirectionDb,
    GameDirection
  >;
  readonly #gameSlotDbToGameSlotConverter: Converter<
    GameSlotDb,
    ActiveGameSlot | FinishedGameSlot | NonStartedGameSlot
  >;

  constructor(
    @Inject(CardBuilder)
    cardBuilder: Builder<Card, [CardDb]>,
    @Inject(CardColorBuilder)
    cardColorBuilder: Builder<CardColor, [CardColorDb]>,
    @Inject(GameDirectionDbToGameDirectionConverter)
    gameDirectionDbToGameDirectionConverter: Converter<
      GameDirectionDb,
      GameDirection
    >,
    @Inject(GameSlotDbToGameSlotConverter)
    gameSlotDbToGameSlotConverter: Converter<
      GameSlotDb,
      ActiveGameSlot | FinishedGameSlot | NonStartedGameSlot
    >,
  ) {
    this.#cardBuilder = cardBuilder;
    this.#cardColorBuilder = cardColorBuilder;
    this.#gameDirectionDbToGameDirectionConverter =
      gameDirectionDbToGameDirectionConverter;
    this.#gameSlotDbToGameSlotConverter = gameSlotDbToGameSlotConverter;
  }

  public convert(gameDb: GameDb): Game {
    const gameSlots: (ActiveGameSlot | NonStartedGameSlot)[] =
      gameDb.gameSlotsDb
        .map((gameSlotDb: GameSlotDb) =>
          this.#gameSlotDbToGameSlotConverter.convert(gameSlotDb),
        )
        .sort(
          (
            gameSlot1: ActiveGameSlot | NonStartedGameSlot,
            gameSlot2: ActiveGameSlot | NonStartedGameSlot,
          ) => gameSlot1.position - gameSlot2.position,
        );

    let game: Game;

    switch (gameDb.status) {
      case GameStatusDb.active:
        game = this.#convertActiveGameDb(gameDb, gameSlots as ActiveGameSlot[]);
        break;
      case GameStatusDb.nonStarted:
        game = this.#convertNonStartedGameDb(
          gameDb,
          gameSlots as NonStartedGameSlot[],
        );
        break;
      case GameStatusDb.finished:
        game = this.#convertFinishedGameDb(
          gameDb,
          gameSlots as FinishedGameSlot[],
        );
        break;
    }

    return game;
  }

  #convertActiveGameDb(
    gameDb: GameDb,
    gameSlots: ActiveGameSlot[],
  ): ActiveGame {
    if (
      gameDb.currentCard === null ||
      gameDb.currentColor === null ||
      gameDb.currentDirection === null ||
      gameDb.currentPlayingSlotIndex === null ||
      gameDb.currentTurnCardsPlayed === null ||
      gameDb.deck === null ||
      gameDb.drawCount === null
    ) {
      throw new AppError(AppErrorKind.unknown, 'Unexpected card spec db entry');
    }

    return {
      id: gameDb.id,
      name: gameDb.name,
      state: {
        currentCard: this.#cardBuilder.build(gameDb.currentCard),
        currentColor: this.#cardColorBuilder.build(gameDb.currentColor),
        currentDirection: this.#gameDirectionDbToGameDirectionConverter.convert(
          gameDb.currentDirection,
        ),
        currentPlayingSlotIndex: gameDb.currentPlayingSlotIndex,
        currentTurnCardsPlayed: gameDb.currentTurnCardsPlayed,
        deck: this.#convertCardSpecs(gameDb.deck),
        discardPile: this.#convertCardSpecs(gameDb.discardPile),
        drawCount: gameDb.drawCount,
        slots: gameSlots,
        status: GameStatus.active,
      },
    };
  }

  #convertFinishedGameDb(
    gameDb: GameDb,
    gameSlots: FinishedGameSlot[],
  ): FinishedGame {
    return {
      id: gameDb.id,
      name: gameDb.name,
      state: {
        slots: gameSlots,
        status: GameStatus.finished,
      },
    };
  }

  #convertNonStartedGameDb(
    gameDb: GameDb,
    gameSlots: NonStartedGameSlot[],
  ): NonStartedGame {
    return {
      id: gameDb.id,
      name: gameDb.name,
      state: {
        slots: gameSlots,
        status: GameStatus.nonStarted,
      },
    };
  }

  #convertCardSpecs(specs: string): GameCardSpec[] {
    const gameCardDbSpecs: unknown = JSON.parse(specs);

    if (!this.#isGameCardSpecDbArray(gameCardDbSpecs)) {
      throw new AppError(AppErrorKind.unknown, 'Unexpected card spec db entry');
    }

    return gameCardDbSpecs.map((gameCardSpecDb: GameCardSpecDb) => ({
      amount: gameCardSpecDb.amount,
      card: this.#cardBuilder.build(gameCardSpecDb.card),
    }));
  }

  #isGameCardSpecDbArray(
    parsedSpecs: unknown,
  ): parsedSpecs is GameCardSpecDb[] {
    return (
      Array.isArray(parsedSpecs) &&
      parsedSpecs.every((parsedSpec: unknown): parsedSpec is GameCardSpecDb =>
        this.#isGameCardSpecDb(parsedSpec),
      )
    );
  }

  #isGameCardSpecDb(parsedSpec: unknown): parsedSpec is GameCardSpecDb {
    return (
      typeof parsedSpec === 'object' &&
      parsedSpec !== null &&
      typeof (parsedSpec as GameCardSpecDb).amount === 'number' &&
      typeof (parsedSpec as GameCardSpecDb).card === 'number'
    );
  }
}
