import { AppError, AppErrorKind, Writable } from '@cornie-js/backend-common';

import { Card } from '../../../cards/domain/valueObjects/Card';
import { GameCardSpec } from '../valueObjects/GameCardSpec';
import { GameDrawMutation } from '../valueObjects/GameDrawMutation';
import { GameInitialDrawsMutation } from '../valueObjects/GameInitialDrawsMutation';
import { GameSpec } from '../valueObjects/GameSpec';

const INITIAL_CARDS_PER_PLAYER: number = 7;

export class GameDrawService {
  public calculateDrawMutation(
    deck: GameCardSpec[],
    discardPile: GameCardSpec[],
    amount: number,
  ): GameDrawMutation {
    return this.#drawCardsFromDeckAndFallBackToDiscardPileIfNecessary(
      deck,
      discardPile,
      amount,
    );
  }

  public calculateInitialCardsDrawMutation(
    gameSpec: GameSpec,
  ): GameInitialDrawsMutation {
    let gameDeckCardsSpec: GameCardSpec[] = gameSpec.cards;
    const playerCardDraws: Card[][] = [];

    for (let i: number = 0; i < gameSpec.gameSlotsAmount; ++i) {
      const drawMutation: GameDrawMutation =
        this.#calculateGameDrawMutationFromDeckOrFail(
          gameDeckCardsSpec,
          INITIAL_CARDS_PER_PLAYER,
        );

      gameDeckCardsSpec = drawMutation.deck;

      playerCardDraws.push(drawMutation.cards);
    }

    const currentCardDrawMutation: GameDrawMutation =
      this.#calculateGameDrawMutationFromDeckOrFail(gameDeckCardsSpec, 1);

    const [currentCard]: [Card] = currentCardDrawMutation.cards as [Card];

    return {
      cards: playerCardDraws,
      currentCard,
      deck: currentCardDrawMutation.deck,
    };
  }

  #calculateDrawMutationFromDeck(
    deck: GameCardSpec[],
    deckCards: number,
    amount: number,
  ): GameDrawMutation {
    const [cards, updatedDeck]: [Card[], GameCardSpec[]] = this.#drawCards(
      deck,
      deckCards,
      amount,
    );

    return {
      cards,
      deck: updatedDeck,
      isDiscardPileEmptied: false,
    };
  }

  #calculateDrawMutationFromDeckAndDiscardPile(
    deck: GameCardSpec[],
    discardPile: GameCardSpec[],
    deckCards: number,
    amount: number,
  ): GameDrawMutation {
    const discardPileCards: number = this.#countCards(discardPile);

    const cardsToDraw: number = Math.min(discardPileCards + deckCards, amount);

    const [cards, updatedDeck]: [Card[], GameCardSpec[]] =
      this.#drawCardsFromDeckAndFallBackToDiscardPile(
        deck,
        discardPile,
        deckCards,
        discardPileCards,
        cardsToDraw,
      );

    return {
      cards,
      deck: updatedDeck,
      isDiscardPileEmptied: true,
    };
  }

  #calculateGameDrawMutationFromDeckOrFail(
    deck: GameCardSpec[],
    amount: number,
  ): GameDrawMutation {
    const drawMutation: GameDrawMutation = this.calculateDrawMutation(
      deck,
      [],
      amount,
    );

    if (drawMutation.isDiscardPileEmptied) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unable to calculate draw. Reason: the spec has not enough cards!',
      );
    }

    return drawMutation;
  }

  #cloneDeck(deck: GameCardSpec[]): GameCardSpec[] {
    return [...deck.map((cardSpec: GameCardSpec) => ({ ...cardSpec }))];
  }

  #countCards(deck: GameCardSpec[]): number {
    return deck.reduce(
      (count: number, cardSpec: GameCardSpec): number =>
        count + cardSpec.amount,
      0,
    );
  }

  #drawCards(
    cards: GameCardSpec[],
    cardsCount: number,
    amount: number,
  ): [Card[], GameCardSpec[]] {
    const drawIndexes: number[] = this.#getSortedCardDrawIndexes(
      cardsCount,
      amount,
    );

    const cardsAndGameDeck: [Card[], GameCardSpec[]] = this.#getCards(
      cards,
      drawIndexes,
    );

    return cardsAndGameDeck;
  }

  #drawCardsFromDeckAndFallBackToDiscardPile(
    deck: GameCardSpec[],
    discardPile: GameCardSpec[],
    deckCardsCount: number,
    discardPileCardsCount: number,
    amount: number,
  ): [Card[], GameCardSpec[]] {
    const [cardsFromDeck]: [Card[], GameCardSpec[]] = this.#drawCards(
      deck,
      deckCardsCount,
      deckCardsCount,
    );

    const cardsDrawnAndGameDeck: [Card[], GameCardSpec[]] = this.#drawCards(
      discardPile,
      discardPileCardsCount,
      amount - deckCardsCount,
    );

    const [cardsDrawn]: [Card[], GameCardSpec[]] = cardsDrawnAndGameDeck;

    cardsDrawn.push(...cardsFromDeck);

    return cardsDrawnAndGameDeck;
  }

  #drawCardsFromDeckAndFallBackToDiscardPileIfNecessary(
    deck: GameCardSpec[],
    discardPile: GameCardSpec[],
    amount: number,
  ): GameDrawMutation {
    const deckCards: number = this.#countCards(deck);

    if (deckCards >= amount) {
      return this.#calculateDrawMutationFromDeck(deck, deckCards, amount);
    }

    return this.#calculateDrawMutationFromDeckAndDiscardPile(
      deck,
      discardPile,
      deckCards,
      amount,
    );
  }

  #getCards(
    deck: GameCardSpec[],
    drawIndexes: number[],
  ): [Card[], GameCardSpec[]] {
    const gameCardSpecsAfterDraw: Writable<GameCardSpec>[] =
      this.#cloneDeck(deck);
    const drawIndexIterator: IterableIterator<number> = drawIndexes.values();
    const gameCardSpecIterator: IterableIterator<GameCardSpec> =
      gameCardSpecsAfterDraw.values();

    const cards: Card[] = this.#getCardsAndMutateDeck(
      drawIndexIterator,
      gameCardSpecIterator,
    );

    return [cards, gameCardSpecsAfterDraw];
  }

  #getCardsAndMutateDeck(
    drawIndexIterator: IterableIterator<number>,
    gameCardSpecIterator: IterableIterator<GameCardSpec>,
  ): Card[] {
    const cards: Card[] = [];
    let cardsTraversed: number = 0;
    let drawIndexIteratorResult: IteratorResult<number, unknown> =
      drawIndexIterator.next();
    let gameCardSpecIteratorResult: IteratorResult<
      Writable<GameCardSpec>,
      unknown
    > = gameCardSpecIterator.next();

    let gameCardSpecDrawn: number = 0;

    while (
      drawIndexIteratorResult.done !== true &&
      gameCardSpecIteratorResult.done !== true
    ) {
      const specMatchesIndex: boolean =
        drawIndexIteratorResult.value <
        cardsTraversed + gameCardSpecIteratorResult.value.amount;

      if (specMatchesIndex) {
        cards.push(gameCardSpecIteratorResult.value.card);
        ++gameCardSpecDrawn;
        drawIndexIteratorResult = drawIndexIterator.next();
      } else {
        cardsTraversed += gameCardSpecIteratorResult.value.amount;
        gameCardSpecIteratorResult.value.amount -= gameCardSpecDrawn;
        gameCardSpecDrawn = 0;
        gameCardSpecIteratorResult = gameCardSpecIterator.next();
      }
    }

    if (gameCardSpecIteratorResult.done === false) {
      gameCardSpecIteratorResult.value.amount -= gameCardSpecDrawn;
    }

    return cards;
  }

  #getSortedCardDrawIndexes(cardsAmount: number, drawAmount: number): number[] {
    const collisionFactor: number = 2;

    if (drawAmount > cardsAmount / collisionFactor) {
      return this.#getSortedCardDrawIndexesFromComplementary(
        cardsAmount,
        drawAmount,
      );
    } else {
      return this.#getSortedCardDrawIndexesRetryingOnCollision(
        cardsAmount,
        drawAmount,
      );
    }
  }

  #getSortedCardDrawIndexesFromComplementary(
    cardsAmount: number,
    drawAmount: number,
  ): number[] {
    const complementaryIterator: IterableIterator<number> =
      this.#getSortedCardDrawIndexesRetryingOnCollision(
        cardsAmount,
        cardsAmount - drawAmount,
      ).values();
    let complementaryIteratorResult: IteratorResult<number, unknown> =
      complementaryIterator.next();

    const randomIndexes: number[] = new Array<number>(drawAmount);
    let currentIndex: number = 0;

    for (let i: number = 0; i < drawAmount; ++i) {
      while (
        complementaryIteratorResult.done === false &&
        complementaryIteratorResult.value === currentIndex
      ) {
        complementaryIteratorResult = complementaryIterator.next();
        ++currentIndex;
      }

      randomIndexes[i] = currentIndex;
      ++currentIndex;
    }

    return randomIndexes;
  }

  #getSortedCardDrawIndexesRetryingOnCollision(
    cardsAmount: number,
    drawAmount: number,
  ): number[] {
    const randomIndexesSet: Set<number> = new Set();

    for (let i: number = 0; i < drawAmount; ++i) {
      let randomIndex: number;

      do {
        randomIndex = Math.floor(Math.random() * cardsAmount);
      } while (randomIndexesSet.has(randomIndex));

      randomIndexesSet.add(randomIndex);
    }

    return [...randomIndexesSet.values()].sort(
      (i1: number, i2: number) => i1 - i2,
    );
  }
}
