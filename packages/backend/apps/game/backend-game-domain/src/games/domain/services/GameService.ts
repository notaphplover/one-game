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
import { IsGameFinishedSpec } from '../specs/IsGameFinishedSpec';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameCardSpec } from '../valueObjects/GameCardSpec';
import { GameDirection } from '../valueObjects/GameDirection';
import { GameDrawMutation } from '../valueObjects/GameDrawMutation';
import { GameInitialDrawsMutation } from '../valueObjects/GameInitialDrawsMutation';
import { GameSpec } from '../valueObjects/GameSpec';
import { GameStatus } from '../valueObjects/GameStatus';
import { NonStartedGameSlot } from '../valueObjects/NonStartedGameSlot';
import { GameDrawService } from './GameDrawService';

const MIN_CARDS_TO_DRAW: number = 1;

const UNO_ORIGINAL_ACTION_CARDS_PER_COLOR: number = 2;
const UNO_ORIGINAL_FIRST_TURN: number = 1;
const UNO_ORIGINAL_NUMBERS_AMOUNT: number = 10;
const UNO_ORIGINAL_NUMBERED_NON_ZERO_CARDS_PER_COLOR: number = 2;
const UNO_ORIGINAL_NUMBERED_ZERO_CARDS_PER_COLOR: number = 1;
const UNO_ORIGINAL_WILD_CARDS_PER_COLOR: number = 4;

@Injectable()
export class GameService {
  readonly #areCardsEqualsSpec: AreCardsEqualsSpec;
  readonly #gameDrawService: GameDrawService;
  readonly #isGameFinishedSpec: IsGameFinishedSpec;

  constructor(
    @Inject(AreCardsEqualsSpec)
    areCardsEqualsSpec: AreCardsEqualsSpec,
    @Inject(GameDrawService)
    gameDrawService: GameDrawService,
    @Inject(IsGameFinishedSpec)
    isGameFinishedSpec: IsGameFinishedSpec,
  ) {
    this.#areCardsEqualsSpec = areCardsEqualsSpec;
    this.#gameDrawService = gameDrawService;
    this.#isGameFinishedSpec = isGameFinishedSpec;
  }

  public buildPassTurnGameUpdateQuery(
    game: ActiveGame,
    gameSpec: GameSpec,
  ): GameUpdateQuery {
    const isPlayerDrawingCards: boolean = !game.state.currentTurnCardsPlayed;

    const gameUpdateQuery: GameUpdateQuery = {
      currentPlayingSlotIndex: this.#getNextTurnPlayerIndex(game, gameSpec),
      currentTurnCardsPlayed: false,
      drawCount: 0,
      gameFindQuery: {
        id: game.id,
        state: {
          currentPlayingSlotIndex: game.state.currentPlayingSlotIndex,
        },
      },
      turn: game.state.turn + 1,
    };

    if (this.#isGameFinishedSpec.isSatisfiedBy(game)) {
      gameUpdateQuery.status = GameStatus.finished;
    }

    if (isPlayerDrawingCards) {
      this.#setPassTurnGameUpdateQueryDrawCards(game, gameUpdateQuery);
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

  public buildStartGameUpdateQuery(
    game: NonStartedGame,
    gameSpec: GameSpec,
  ): GameUpdateQuery {
    const gameInitialDraws: GameInitialDrawsMutation =
      this.#gameDrawService.calculateInitialCardsDrawMutation(gameSpec);

    const gameSlotUpdateQueries: GameSlotUpdateQuery[] =
      gameInitialDraws.cards.map(
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
      deck: gameInitialDraws.deck,
      drawCount: this.#getInitialDrawCount(),
      gameFindQuery: {
        id: game.id,
      },
      gameSlotUpdateQueries,
      skipCount: 0,
      status: GameStatus.active,
      turn: UNO_ORIGINAL_FIRST_TURN,
    };

    return gameUpdateQuery;
  }

  public getInitialCardsSpec(): GameCardSpec[] {
    const [zeroNumber, ...nonZeroNumbers]: [number, ...number[]] = new Array(
      UNO_ORIGINAL_NUMBERS_AMOUNT,
    )
      .fill(null)
      .map((_: unknown, index: number) => index) as [number, ...number[]];

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

  #setPassTurnGameUpdateQueryDrawCards(
    game: ActiveGame,
    gameUpdateQuery: GameUpdateQuery,
  ): void {
    const cardsToDraw: number = Math.max(
      MIN_CARDS_TO_DRAW,
      game.state.drawCount,
    );

    const drawMutation: GameDrawMutation =
      this.#gameDrawService.calculateDrawMutation(
        game.state.deck,
        game.state.discardPile,
        cardsToDraw,
      );

    if (drawMutation.isDiscardPileEmptied) {
      gameUpdateQuery.discardPile = [];
    }

    const playerSlot: ActiveGameSlot = this.#getGameSlotOrThrow(
      game,
      game.state.currentPlayingSlotIndex,
    );

    gameUpdateQuery.deck = drawMutation.deck;
    gameUpdateQuery.gameSlotUpdateQueries = [
      {
        cards: [...playerSlot.cards, ...drawMutation.cards],
        gameSlotFindQuery: {
          gameId: game.id,
          position: game.state.currentPlayingSlotIndex,
        },
      },
    ];
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

  #getInitialDirection(): GameDirection {
    return GameDirection.antiClockwise;
  }

  #getInitialDrawCount(): number {
    return 0;
  }

  #getInitialPlayingSlotIndex(): number {
    return 0;
  }

  #getNextTurnPlayerIndex(game: ActiveGame, gameSpec: GameSpec): number {
    const players: number = gameSpec.gameSlotsAmount;

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
}
