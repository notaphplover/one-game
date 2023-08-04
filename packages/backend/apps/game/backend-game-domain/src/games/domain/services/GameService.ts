import { AppError, AppErrorKind, Writable } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { AreCardsEqualsSpec } from '../../../cards/domain/specs/AreCardsEqualsSpec';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { CardKind } from '../../../cards/domain/valueObjects/CardKind';
import { ColoredCard } from '../../../cards/domain/valueObjects/ColoredCard';
import { SkipCard } from '../../../cards/domain/valueObjects/SkipCard';
import { ActiveGame } from '../entities/ActiveGame';
import { Game } from '../entities/Game';
import { NonStartedGame } from '../entities/NonStartedGame';
import { GameSlotUpdateQuery } from '../query/GameSlotUpdateQuery';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameCardSpec } from '../valueObjects/GameCardSpec';
import { GameDirection } from '../valueObjects/GameDirection';
import { GameInitialDraws } from '../valueObjects/GameInitialDraws';
import { GameStatus } from '../valueObjects/GameStatus';
import { NonStartedGameSlot } from '../valueObjects/NonStartedGameSlot';

const INITIAL_CARDS_PER_PLAYER: number = 7;

const MIN_CARDS_TO_DRAW: number = 1;

const UNO_ORIGINAL_ACTION_CARDS_PER_COLOR: number = 2;
const UNO_ORIGINAL_NUMBERS_AMOUNT: number = 10;
const UNO_ORIGINAL_NUMBERED_NON_ZERO_CARDS_PER_COLOR: number = 2;
const UNO_ORIGINAL_NUMBERED_ZERO_CARDS_PER_COLOR: number = 1;
const UNO_ORIGINAL_WILD_CARDS_PER_COLOR: number = 4;

@Injectable()
export class GameService {
  #areCardsEqualsSpec: AreCardsEqualsSpec;

  constructor(
    @Inject(AreCardsEqualsSpec)
    areCardsEqualsSpec: AreCardsEqualsSpec,
  ) {
    this.#areCardsEqualsSpec = areCardsEqualsSpec;
  }

  public buildPassTurnGameUpdateQuery(game: ActiveGame): GameUpdateQuery {
    const isPlayerDrawingCards: boolean = !game.state.currentTurnCardsPlayed;

    const gameUpdateQuery: GameUpdateQuery = {
      currentPlayingSlotIndex: this.#getNextTurnPlayerIndex(game),
      currentTurnCardsPlayed: false,
      drawCount: 0,
      gameFindQuery: {
        id: game.id,
        state: {
          currentPlayingSlotIndex: game.state.currentPlayingSlotIndex,
        },
      },
    };

    if (isPlayerDrawingCards) {
      const playerSlot: ActiveGameSlot = this.#getGameSlotOrThrow(
        game,
        game.state.currentPlayingSlotIndex,
      );

      const cardsToDraw: number = Math.max(
        MIN_CARDS_TO_DRAW,
        game.state.drawCount,
      );

      const [cardsDrawn, gameDeckCardsSpec]: [Card[], GameCardSpec[]] =
        this.#drawCards(game.spec.cards, cardsToDraw);

      gameUpdateQuery.deck = gameDeckCardsSpec;
      gameUpdateQuery.gameSlotUpdateQueries = [
        {
          cards: [...playerSlot.cards, ...cardsDrawn],
          gameSlotFindQuery: {
            gameId: game.id,
            position: game.state.currentPlayingSlotIndex,
          },
        },
      ];
    }

    return gameUpdateQuery;
  }

  public buildPlayCardsGameUpdateQuery(
    game: ActiveGame,
    cardIndexes: number[],
    slotIndex: number,
    colorChoice: CardColor | undefined,
  ): GameUpdateQuery {
    const gameSlot: ActiveGameSlot = this.#getGameSlotOrThrow(game, slotIndex);

    const nextCurrentCards: [Card, ...Card[]] =
      this.#getPlayCardsGameUpdateQueryNextCurrentCard(gameSlot, cardIndexes);

    const nextDiscardPile: GameCardSpec[] = this.#buildNextDiscardPile(
      game,
      nextCurrentCards,
    );

    const [nextCurrentCard]: [Card, ...Card[]] = nextCurrentCards;

    const gameUpdateQuery: GameUpdateQuery = {
      currentCard: nextCurrentCard,
      discardPile: nextDiscardPile,
      gameFindQuery: {
        id: game.id,
        state: {
          currentPlayingSlotIndex: game.state.currentPlayingSlotIndex,
        },
      },
      gameSlotUpdateQueries: [
        {
          cards: gameSlot.cards.filter((_: Card, index: number): boolean =>
            cardIndexes.includes(index),
          ),
          gameSlotFindQuery: {
            gameId: game.id,
            position: slotIndex,
          },
        },
      ],
    };

    this.#setPlayCardsGameUpdateQueryColor(
      gameUpdateQuery,
      nextCurrentCard,
      colorChoice,
    );

    this.#setPlayCardsGameUpdateQueryDirection(
      game,
      gameUpdateQuery,
      nextCurrentCard,
    );

    return gameUpdateQuery;
  }

  public buildStartGameUpdateQuery(game: NonStartedGame): GameUpdateQuery {
    const gameInitialDraws: GameInitialDraws = this.#getInitialCardsDraw(game);

    const gameSlotUpdateQueries: GameSlotUpdateQuery[] =
      gameInitialDraws.playersCards.map(
        (cards: Card[], index: number): GameSlotUpdateQuery => ({
          cards: cards,
          gameSlotFindQuery: {
            gameId: game.id,
            position: index,
          },
        }),
      );

    const gameUpdateQuery: GameUpdateQuery = {
      currentCard: gameInitialDraws.currentCard,
      currentColor: this.#getInitialCardColor(gameInitialDraws.currentCard),
      currentDirection: this.#getInitialDirection(),
      currentPlayingSlotIndex: this.#getInitialPlayingSlotIndex(),
      currentTurnCardsPlayed: false,
      deck: gameInitialDraws.remainingDeck,
      drawCount: this.#getInitialDrawCount(),
      gameFindQuery: {
        id: game.id,
      },
      gameSlotUpdateQueries,
      status: GameStatus.active,
    };

    return gameUpdateQuery;
  }

  public getInitialCardsSpec(): GameCardSpec[] {
    const [zeroNumber, ...nonZeroNumbers]: [number, ...number[]] = new Array(
      UNO_ORIGINAL_NUMBERS_AMOUNT,
    ).map((_: unknown, index: number) => index) as [number, ...number[]];

    const actionCardKinds: (
      | CardKind.draw
      | CardKind.reverse
      | CardKind.skip
    )[] = [CardKind.draw, CardKind.reverse, CardKind.skip];

    const wildCardKinds: (CardKind.wild | CardKind.wildDraw4)[] = [
      CardKind.wild,
      CardKind.wildDraw4,
    ];

    return [
      ...Object.values(CardColor).map(
        (color: CardColor): GameCardSpec => ({
          amount: UNO_ORIGINAL_NUMBERED_ZERO_CARDS_PER_COLOR,
          card: {
            color,
            kind: CardKind.normal,
            number: zeroNumber,
          },
        }),
      ),
      ...Object.values(CardColor)
        .map((color: CardColor): GameCardSpec[] =>
          nonZeroNumbers.map(
            (number: number): GameCardSpec => ({
              amount: UNO_ORIGINAL_NUMBERED_NON_ZERO_CARDS_PER_COLOR,
              card: {
                color,
                kind: CardKind.normal,
                number,
              },
            }),
          ),
        )
        .flat(),
      ...Object.values(CardColor)
        .map((color: CardColor): GameCardSpec[] =>
          actionCardKinds.map(
            (
              kind: CardKind.draw | CardKind.reverse | CardKind.skip,
            ): GameCardSpec => ({
              amount: UNO_ORIGINAL_ACTION_CARDS_PER_COLOR,
              card: {
                color,
                kind: kind,
              },
            }),
          ),
        )
        .flat(),
      ...wildCardKinds.map(
        (kind: CardKind.wild | CardKind.wildDraw4): GameCardSpec => ({
          amount: UNO_ORIGINAL_WILD_CARDS_PER_COLOR,
          card: {
            kind: kind,
          },
        }),
      ),
    ];
  }

  #buildNextDiscardPile(
    game: ActiveGame,
    nextCurrentCards: Card[],
  ): GameCardSpec[] {
    const nextDiscardPile: GameCardSpec[] = game.state.discardPile.map(
      (gameCardSpec: GameCardSpec) => ({ ...gameCardSpec }),
    );

    this.#putCardsInDiscardPile(nextDiscardPile, nextCurrentCards);

    return nextDiscardPile;
  }

  #putCardsInDiscardPile(discardPile: GameCardSpec[], cards: Card[]): void {
    for (const card of cards) {
      this.#putCardInDiscardPile(discardPile, card);
    }
  }

  #putCardInDiscardPile(discardPile: GameCardSpec[], card: Card): void {
    const cardsToAdd: number = 1;
    let cardSpec: Writable<GameCardSpec> | undefined = discardPile.find(
      (cardSpec: GameCardSpec) =>
        this.#areCardsEqualsSpec.isSatisfiedBy(card, cardSpec.card),
    );

    if (cardSpec === undefined) {
      cardSpec = {
        amount: 0,
        card,
      };

      discardPile.push(cardSpec);
    }

    cardSpec.amount += cardsToAdd;
  }

  #setPlayCardsGameUpdateQueryColor(
    gameUpdateQuery: GameUpdateQuery,
    nextCurrentCard: Card,
    colorChoice: CardColor | undefined,
  ): void {
    if (this.#isColored(nextCurrentCard)) {
      if (colorChoice !== undefined) {
        throw new AppError(
          AppErrorKind.unprocessableOperation,
          'Operation not allowed. Reason: unexpected color choice when playing these cards',
        );
      }

      gameUpdateQuery.currentColor = nextCurrentCard.color;
    } else {
      if (colorChoice === undefined) {
        throw new AppError(
          AppErrorKind.unprocessableOperation,
          'Operation not allowed. Reason: expecting a color choice when playing these cards',
        );
      }

      gameUpdateQuery.currentColor = colorChoice;
    }
  }

  #setPlayCardsGameUpdateQueryDirection(
    game: ActiveGame,
    gameUpdateQuery: GameUpdateQuery,
    nextCurrentCard: Card,
  ): void {
    if (this.#isSkip(nextCurrentCard)) {
      gameUpdateQuery.currentDirection = this.#getReverseDirection(
        game.state.currentDirection,
      );
    }
  }

  #drawCards(cards: GameCardSpec[], amount: number): [Card[], GameCardSpec[]] {
    const gameCards: number = cards.reduce(
      (count: number, cardSpec: GameCardSpec) => count + cardSpec.amount,
      0,
    );

    const drawIndexes: number[] = this.#getSortedCardDrawIndexes(
      gameCards,
      amount,
    );

    const cardsAndGameDeck: [Card[], GameCardSpec[]] = this.#getCardsFromDeck(
      cards,
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
    deckCards: GameCardSpec[],
    drawIndexes: number[],
  ): [Card[], GameCardSpec[]] {
    const cards: Card[] = [];
    const gameDeckCardSpecsAfterDraw: Writable<GameCardSpec>[] = [
      ...deckCards.map((cardSpec: GameCardSpec) => ({ ...cardSpec })),
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

  #getPlayCardsGameUpdateQueryNextCurrentCard(
    gameSlot: ActiveGameSlot,
    cardIndexes: number[],
  ): [Card, ...Card[]] {
    const nextCurrentCards: Card[] = cardIndexes.map((cardIndex: number) => {
      const card: Card | undefined = gameSlot.cards[cardIndex];

      if (card === undefined) {
        throw new AppError(
          AppErrorKind.unknown,
          'An unexpected error happened while attempting to update game',
        );
      }

      return card;
    });

    if (nextCurrentCards[0] === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        'An unexpected error happened while attempting to update game',
      );
    }

    return nextCurrentCards as [Card, ...Card[]];
  }

  #getGameSlotOrThrow(game: ActiveGame, index: number): ActiveGameSlot;
  #getGameSlotOrThrow(game: NonStartedGame, index: number): NonStartedGameSlot;
  #getGameSlotOrThrow(
    game: Game,
    index: number,
  ): ActiveGameSlot | NonStartedGameSlot {
    const gameSlot: ActiveGameSlot | NonStartedGameSlot | undefined =
      game.state.slots[index];

    if (gameSlot === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `Expecting a game slot at index "${index}", none found instead.`,
      );
    }

    return gameSlot;
  }

  #getInitialCardColor(card: Card): CardColor {
    const cardAsMaybeColoredCard: Partial<ColoredCard> =
      card as Partial<ColoredCard>;

    if (cardAsMaybeColoredCard.color !== undefined) {
      return cardAsMaybeColoredCard.color;
    }

    return this.#getRandomColor();
  }

  #getInitialCardsDraw(game: NonStartedGame): GameInitialDraws {
    const [cardsDrawn, gameDeckCardsSpec]: [Card[], GameCardSpec[]] =
      this.#drawCards(
        game.spec.cards,
        INITIAL_CARDS_PER_PLAYER * game.spec.gameSlotsAmount + 1,
      );

    this.#shuffle(cardsDrawn);

    const currentCard: Card = cardsDrawn.pop() as Card;

    return {
      currentCard,
      playersCards: this.#splitAllInEqualParts(
        cardsDrawn,
        game.spec.gameSlotsAmount,
      ),
      remainingDeck: gameDeckCardsSpec,
    };
  }

  #getInitialDirection(): GameDirection {
    return GameDirection.antiClockwise;
  }

  #getInitialDrawCount(): number {
    return 0;
  }

  #getInitialPlayingSlotIndex(): number {
    return 0;
  }

  #getNextTurnPlayerIndex(game: ActiveGame): number {
    const players: number = game.spec.gameSlotsAmount;

    const direction: GameDirection = game.state.currentDirection;

    let nextTurnPlayerIndex: number;

    if (direction === GameDirection.antiClockwise) {
      nextTurnPlayerIndex = game.state.currentPlayingSlotIndex - 1;

      if (nextTurnPlayerIndex < 0) {
        nextTurnPlayerIndex = players - 1;
      }
    } else {
      nextTurnPlayerIndex = game.state.currentPlayingSlotIndex + 1;

      if (nextTurnPlayerIndex === players) {
        nextTurnPlayerIndex = 0;
      }
    }

    return nextTurnPlayerIndex;
  }

  #getReverseDirection(direction: GameDirection): GameDirection {
    switch (direction) {
      case GameDirection.antiClockwise:
        return GameDirection.clockwise;
      case GameDirection.clockwise:
        return GameDirection.antiClockwise;
    }
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

  #isColored(card: Card): card is Card & ColoredCard {
    return (card as ColoredCard).color !== undefined;
  }

  #isSkip(card: Card): card is SkipCard {
    return card.kind === CardKind.skip;
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
