import { Inject, Injectable } from '@nestjs/common';
import {
  AppError,
  AppErrorKind,
  Builder,
  Converter,
} from '@one-game-js/backend-common';

import { CardBuilder } from '../../../../cards/adapter/typeorm/builders/CardBuilder';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { Card } from '../../../../cards/domain/models/Card';
import { ActiveGameSlot } from '../../../domain/models/ActiveGameSlot';
import { NonStartedGameSlot } from '../../../domain/models/NonStartedGameSlot';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class GameSlotDbToGameSlotConverter
  implements Converter<GameSlotDb, ActiveGameSlot | NonStartedGameSlot>
{
  readonly #cardBuilder: Builder<Card, [CardDb]>;

  constructor(@Inject(CardBuilder) cardBuilder: Builder<Card, [CardDb]>) {
    this.#cardBuilder = cardBuilder;
  }

  public convert(gameSlotDb: GameSlotDb): ActiveGameSlot | NonStartedGameSlot {
    if (gameSlotDb.cards === null) {
      return this.#convertToNonStartedGameSlot(gameSlotDb);
    } else {
      return this.#convertToActiveGameSlots(gameSlotDb);
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

  #convertToActiveGameSlots(gameSlotDb: GameSlotDb): ActiveGameSlot {
    if (gameSlotDb.userId === null) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected null userId on active game slot',
      );
    }

    return {
      cards: this.#buildCards(gameSlotDb.cards as string),
      userId: gameSlotDb.userId,
    };
  }

  #convertToNonStartedGameSlot(gameSlotDb: GameSlotDb): NonStartedGameSlot {
    return {
      userId: gameSlotDb.userId ?? undefined,
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
