import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { Inject, Injectable } from '@nestjs/common';

import { CardDb } from '../models/CardDb';
import { CardBuilder } from './CardBuilder';

@Injectable()
export class CardArrayFromCardDbStringifiedArrayBuilder
  implements Builder<Card[], [string]>
{
  readonly #cardBuilder: Builder<Card, [CardDb]>;

  constructor(@Inject(CardBuilder) cardBuilder: Builder<Card, [CardDb]>) {
    this.#cardBuilder = cardBuilder;
  }

  public build(stringifiedCards: string): Card[] {
    const jsonCards: unknown = this.#parseCards(stringifiedCards);

    if (!this.#isNumberArray(jsonCards)) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected game slot cards JSON value',
      );
    }

    return jsonCards.map((cardDb: CardDb) => this.#cardBuilder.build(cardDb));
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
          'Unexpected error parsing cards JSON array',
        );
      }
    }
  }
}
