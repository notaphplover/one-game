import { AppError, AppErrorKind, Spec } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { AreCardsEqualsSpec } from '../../../cards/domain/specs/AreCardsEqualsSpec';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameOptions } from '../valueObjects/GameOptions';
import { CardCanBePlayedSpec } from './CardCanBePlayedSpec';

@Injectable()
export class CurrentPlayerCanPlayCardsSpec
  implements Spec<[ActiveGame, GameOptions, number[]]>
{
  readonly #areCardsEqualsSpec: AreCardsEqualsSpec;
  readonly #cardCanBePlayedSpec: CardCanBePlayedSpec;

  constructor(
    @Inject(AreCardsEqualsSpec)
    areCardsEqualsSpec: AreCardsEqualsSpec,
    @Inject(CardCanBePlayedSpec)
    cardCanBePlayedSpec: CardCanBePlayedSpec,
  ) {
    this.#areCardsEqualsSpec = areCardsEqualsSpec;
    this.#cardCanBePlayedSpec = cardCanBePlayedSpec;
  }

  public isSatisfiedBy(
    activeGame: ActiveGame,
    gameOptions: GameOptions,
    cardIndexes: number[],
  ): boolean {
    if (activeGame.state.currentTurnCardsPlayed) {
      return false;
    }

    if (this.#areRepeated(cardIndexes)) {
      return false;
    }

    const activeGameSlot: ActiveGameSlot =
      this.#getActiveGameSlotOrThrow(activeGame);

    const cards: Card[] | undefined = this.#tryGetCards(
      activeGameSlot,
      cardIndexes,
    );

    if (!this.#areValidCardsAmount(cards, gameOptions)) {
      return false;
    }

    const [card]: [Card, ...Card[]] = cards;

    if (
      activeGame.state.currentTurnCardsDrawn &&
      !this.#areValidCardsAfterDraw(activeGame, cards)
    ) {
      return false;
    }

    return (
      cards !== undefined &&
      this.#areCardsEqualsSpec.isSatisfiedBy(...cards) &&
      this.#cardCanBePlayedSpec.isSatisfiedBy(card, activeGame, gameOptions)
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

  #areValidCardsAfterDraw(
    activeGame: ActiveGame,
    cards: [Card, ...Card[]],
  ): boolean {
    const [firstCard]: [Card, ...Card[]] = cards;

    return (
      cards.length === 1 &&
      activeGame.state.currentTurnSingleCardDraw !== undefined &&
      this.#areCardsEqualsSpec.isSatisfiedBy(
        firstCard,
        activeGame.state.currentTurnSingleCardDraw,
      )
    );
  }

  #areValidCardsAmount(
    cards: Card[] | undefined,
    gameOptions: GameOptions,
  ): cards is [Card, ...Card[]] {
    if (cards === undefined) {
      return false;
    }

    if (gameOptions.playMultipleSameCards) {
      return cards.length !== 0;
    } else {
      return cards.length === 1;
    }
  }

  #getActiveGameSlotOrThrow(game: ActiveGame): ActiveGameSlot {
    const slotIndex: number = game.state.currentPlayingSlotIndex;
    const activeGameSlot: ActiveGameSlot | undefined =
      game.state.slots[slotIndex];

    if (activeGameSlot === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `Game slot at position "${slotIndex}" not found for game "${game.id}"`,
      );
    }

    return activeGameSlot;
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
