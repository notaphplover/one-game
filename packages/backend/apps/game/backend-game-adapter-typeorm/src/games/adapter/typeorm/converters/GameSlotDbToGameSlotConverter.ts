import {
  AppError,
  AppErrorKind,
  Builder,
  Converter,
} from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGameSlot,
  FinishedGameSlot,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CardBuilder } from '../../../../cards/adapter/typeorm/builders/CardBuilder';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class GameSlotDbToGameSlotConverter
  implements
    Converter<
      GameSlotDb,
      ActiveGameSlot | FinishedGameSlot | NonStartedGameSlot
    >
{
  readonly #cardBuilder: Builder<Card, [CardDb]>;

  constructor(@Inject(CardBuilder) cardBuilder: Builder<Card, [CardDb]>) {
    this.#cardBuilder = cardBuilder;
  }

  public convert(
    gameSlotDb: GameSlotDb,
  ): ActiveGameSlot | FinishedGameSlot | NonStartedGameSlot {
    if (gameSlotDb.cards === null) {
      return this.#convertToNonStartedGameSlot(gameSlotDb);
    } else {
      return this.#convertToActiveOrFinishedGameSlots(gameSlotDb);
    }
  }

  #buildCards(stringifiedCards: string): Card[] {
    const jsonCards: unknown = this.#parseCards(stringifiedCards);

    if (!this.#isNumberArray(jsonCards)) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected active game slot cards JSON value',
      );
    }

    return jsonCards.map((cardDb: CardDb) => this.#cardBuilder.build(cardDb));
  }

  #convertToActiveOrFinishedGameSlots(
    gameSlotDb: GameSlotDb,
  ): ActiveGameSlot | FinishedGameSlot {
    if (gameSlotDb.userId === null) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected null userId on active game slot',
      );
    }

    return {
      cards: this.#buildCards(gameSlotDb.cards as string),
      position: gameSlotDb.position,
      userId: gameSlotDb.userId,
    };
  }

  #convertToNonStartedGameSlot(gameSlotDb: GameSlotDb): NonStartedGameSlot {
    return {
      position: gameSlotDb.position,
      userId: gameSlotDb.userId,
    };
  }

  #isNumberArray(value: unknown): value is number[] {
    return (
      Array.isArray(value) &&
      value.every((element: unknown) => typeof element === 'number')
    );
  }

  #parseCards(stringifiedCards: string): unknown {
    try {
      return JSON.parse(stringifiedCards);
    } catch (error: unknown) {
      if (AppError.isAppError(error)) {
        throw error;
      } else {
        throw new AppError(
          AppErrorKind.unknown,
          'Unexpected error parsing active game slot cards JSON',
        );
      }
    }
  }
}
