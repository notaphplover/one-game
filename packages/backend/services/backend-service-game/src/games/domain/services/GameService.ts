import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Card } from '../../../cards/domain/models/Card';
import { CardColor } from '../../../cards/domain/models/CardColor';
import { ColoredCard } from '../../../cards/domain/models/ColoredCard';
import { Writable } from '../../../foundation/common/application/models/Writable';
import { Game } from '../models/Game';
import { GameCardSpec } from '../models/GameCardSpec';
import { GameDirection } from '../models/GameDirection';
import { GameInitialDraws } from '../models/GameInitialDraws';

const INITIAL_CARDS_PER_PLAYER: number = 7;

@Injectable()
export class GameService {
  public getInitialCardColor(card: Card): CardColor {
    const cardAsMaybeColoredCard: Partial<ColoredCard> =
      card as Partial<ColoredCard>;

    if (cardAsMaybeColoredCard.color !== undefined) {
      return cardAsMaybeColoredCard.color;
    }

    return this.#getRandomColor();
  }

  public getInitialCardsDraw(game: Game): GameInitialDraws {
    const [cardsDrawn, gameDeckCardsSpec]: [Card[], GameCardSpec[]] =
      this.#drawCards(
        game,
        INITIAL_CARDS_PER_PLAYER * game.gameSlotsAmount + 1,
      );

    this.#shuffle(cardsDrawn);

    const currentCard: Card = cardsDrawn.pop() as Card;

    return {
      currentCard,
      playersCards: this.#splitAllInEqualParts(
        cardsDrawn,
        game.gameSlotsAmount,
      ),
      remainingDeck: gameDeckCardsSpec,
    };
  }

  public getInitialDirection(): GameDirection {
    return GameDirection.antiClockwise;
  }

  public getInitialPlayingSlotIndex(): number {
    return 0;
  }

  #drawCards(game: Game, amount: number): [Card[], GameCardSpec[]] {
    const gameCards: number = game.deck.reduce(
      (count: number, cardSpec: GameCardSpec) => count + cardSpec.amount,
      0,
    );

    const drawIndexes: number[] = this.#getSortedCardDrawIndexes(
      gameCards,
      amount,
    );

    const cardsAndGameDeck: [Card[], GameCardSpec[]] = this.#getCardsFromDeck(
      game,
      drawIndexes,
    );

    const [cardsDrawn]: [Card[], GameCardSpec[]] = cardsAndGameDeck;

    if (cardsDrawn.length < amount) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Deck has not enough cards to perform this operation',
      );
    }

    return cardsAndGameDeck;
  }

  #getCardsFromDeck(
    game: Game,
    drawIndexes: number[],
  ): [Card[], GameCardSpec[]] {
    const cards: Card[] = [];
    const gameDeckCardSpecsAfterDraw: Writable<GameCardSpec>[] = [
      ...game.deck.map((cardSpec: GameCardSpec) => ({ ...cardSpec })),
    ];

    let cardsTraversed: number = 0;
    const drawIndexesIterator: IterableIterator<number> = drawIndexes.values();

    let drawIndexIteratorResult: IteratorResult<number, unknown> =
      drawIndexesIterator.next();

    if (drawIndexIteratorResult.done === true) {
      return [cards, gameDeckCardSpecsAfterDraw];
    }

    for (const spec of gameDeckCardSpecsAfterDraw) {
      let currentSpecExtractions: number = 0;

      cardsTraversed += spec.amount;

      while (drawIndexIteratorResult.value < cardsTraversed) {
        cards.push(spec.card);
        ++currentSpecExtractions;
        drawIndexIteratorResult = drawIndexesIterator.next();

        if (drawIndexIteratorResult.done === true) {
          spec.amount -= currentSpecExtractions;

          return [cards, gameDeckCardSpecsAfterDraw];
        }
      }

      spec.amount -= currentSpecExtractions;
    }

    return [cards, gameDeckCardSpecsAfterDraw];
  }

  #getSortedCardDrawIndexes(cardsAmount: number, drawAmount: number): number[] {
    if (drawAmount > cardsAmount) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Not enough cards to perform this operation',
      );
    }

    const randomIndexes: number[] = new Array<number>(drawAmount);

    for (let i: number = 0; i < drawAmount; ++i) {
      let randomIndex: number = Math.floor(Math.random() * (cardsAmount - i));

      for (let j: number = 0; j < i; ++j) {
        const previousRandomIndex: number = randomIndexes[j] as number;

        if (previousRandomIndex >= randomIndex) {
          randomIndex += 1;
        }
      }

      randomIndexes[i] = randomIndex;
    }

    randomIndexes.sort((i1: number, i2: number) => i1 - i2);

    return randomIndexes;
  }

  #getRandomColor(): CardColor {
    const cardColorArray: CardColor[] = Object.values(CardColor);

    const colorCount: number = cardColorArray.length;
    const randomIndex: number = Math.floor(Math.random() * colorCount);

    return cardColorArray[randomIndex] as CardColor;
  }

  #shuffle<T>(array: T[]): void {
    let pivot: T;

    for (let i: number = array.length - 1; i >= 0; --i) {
      const randomIndex: number = Math.floor(Math.random() * i);

      pivot = array[randomIndex] as T;
      array[randomIndex] = array[i] as T;
      array[i] = pivot;
    }
  }

  #splitAllInEqualParts<T>(array: T[], amount: number): T[][] {
    if (amount <= 0) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected negative split amount',
      );
    }

    if (amount !== Math.floor(amount)) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected non integeer split amount',
      );
    }

    if (array.length % amount !== 0) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected amount. Expected such an amount that can be equally divided',
      );
    }

    const arrayArray: T[][] = [];

    const maxLengthArrayLength: number = array.length / amount;

    for (let i: number = 0; i < amount; ++i) {
      const start: number = i * maxLengthArrayLength;
      const end: number = start + maxLengthArrayLength;

      arrayArray.push(array.slice(start, end));
    }

    return arrayArray;
  }
}
