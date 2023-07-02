import { Spec } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { Card } from '../../../cards/domain/models/Card';
import { AreCardsEqualsSpec } from '../../../cards/domain/specs/AreCardsEqualsSpec';
import { ActiveGameSlot } from '../models/ActiveGameSlot';
import { GameOptions } from '../models/GameOptions';

@Injectable()
export class PlayerCanPlayCardsSpec
  implements Spec<[ActiveGameSlot, GameOptions, number[]]>
{
  readonly #areCardsEqualsSpec: AreCardsEqualsSpec;

  constructor(
    @Inject(AreCardsEqualsSpec)
    areCardsEqualsSpec: AreCardsEqualsSpec,
  ) {
    this.#areCardsEqualsSpec = areCardsEqualsSpec;
  }

  public isSatisfiedBy(
    activeGameSlot: ActiveGameSlot,
    gameOptions: GameOptions,
    cardIndexes: number[],
  ): boolean {
    if (this.#areRepeated(cardIndexes)) {
      return false;
    }

    if (gameOptions.playMultipleSameCards) {
      if (cardIndexes.length === 0) {
        return false;
      }
    } else {
      if (cardIndexes.length !== 1) {
        return false;
      }
    }

    const cards: Card[] | undefined = this.#tryGetCards(
      activeGameSlot,
      cardIndexes,
    );

    return (
      cards !== undefined && this.#areCardsEqualsSpec.isSatisfiedBy(...cards)
    );
  }

  #areRepeated(numbers: number[]): boolean {
    return numbers.sort().some(
      (value: number, index: number, numbers: number[]) =>
        /*
         * Considering [][-1] is evaluated to undefined.
         * Negative keys are not expected: https://262.ecma-international.org/14.0/#sec-object-type
         */
        numbers[index - 1] === value,
    );
  }

  #tryGetCards(
    gameSlot: ActiveGameSlot,
    cardIndexes: number[],
  ): Card[] | undefined {
    const cards: (Card | undefined)[] = cardIndexes.map(
      (cardIndex: number): Card | undefined => gameSlot.cards[cardIndex],
    );

    if (this.#isCardArray(cards)) {
      return cards;
    }

    return undefined;
  }

  #isCardArray(cards: (Card | undefined)[]): cards is Card[] {
    return cards.every((card: Card | undefined) => card !== undefined);
  }
}
