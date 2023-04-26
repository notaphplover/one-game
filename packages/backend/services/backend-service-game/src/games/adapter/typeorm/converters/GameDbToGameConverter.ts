import { Inject, Injectable } from '@nestjs/common';
import {
  AppError,
  AppErrorKind,
  Builder,
  Converter,
} from '@one-game-js/backend-common';

import { CardBuilder } from '../../../../cards/adapter/typeorm/builders/CardBuilder';
import { CardColorBuilder } from '../../../../cards/adapter/typeorm/builders/CardColorBuilder';
import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { Card } from '../../../../cards/domain/models/Card';
import { CardColor } from '../../../../cards/domain/models/CardColor';
import { ActiveGame } from '../../../domain/models/ActiveGame';
import { ActiveGameSlot } from '../../../domain/models/ActiveGameSlot';
import { Game } from '../../../domain/models/Game';
import { GameCardSpec } from '../../../domain/models/GameCardSpec';
import { GameDirection } from '../../../domain/models/GameDirection';
import { NonStartedGame } from '../../../domain/models/NonStartedGame';
import { NonStartedGameSlot } from '../../../domain/models/NonStartedGameSlot';
import { GameCardSpecDb } from '../models/GameCardSpecDb';
import { GameDb } from '../models/GameDb';
import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameSlotDb } from '../models/GameSlotDb';
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
    ActiveGameSlot | NonStartedGameSlot
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
      ActiveGameSlot | NonStartedGameSlot
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

    if (gameDb.active) {
      game = this.#convertActiveGameDb(gameDb, gameSlots as ActiveGameSlot[]);
    } else {
      game = this.#convertNonStartedGameDb(
        gameDb,
        gameSlots as NonStartedGameSlot[],
      );
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
      gameDb.currentPlayingSlotIndex === null
    ) {
      throw new AppError(AppErrorKind.unknown, 'Unexpected card spec db entry');
    }

    return {
      active: true,
      currentCard: this.#cardBuilder.build(gameDb.currentCard),
      currentColor: this.#cardColorBuilder.build(gameDb.currentColor),
      currentDirection: this.#gameDirectionDbToGameDirectionConverter.convert(
        gameDb.currentDirection,
      ),
      currentPlayingSlotIndex: gameDb.currentPlayingSlotIndex,
      deck: this.#convertCardSpecs(gameDb.deck),
      gameSlotsAmount: gameDb.gameSlotsAmount,
      id: gameDb.id,
      slots: gameSlots,
      spec: this.#convertCardSpecs(gameDb.spec),
    };
  }

  #convertNonStartedGameDb(
    gameDb: GameDb,
    gameSlots: NonStartedGameSlot[],
  ): NonStartedGame {
    return {
      active: false,
      deck: this.#convertCardSpecs(gameDb.deck),
      gameSlotsAmount: gameDb.gameSlotsAmount,
      id: gameDb.id,
      slots: gameSlots,
      spec: this.#convertCardSpecs(gameDb.spec),
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
