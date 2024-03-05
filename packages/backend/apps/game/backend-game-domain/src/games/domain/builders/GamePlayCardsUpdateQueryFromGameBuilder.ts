import {
  AppError,
  AppErrorKind,
  Builder,
  Writable,
} from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { AreCardsEqualsSpec } from '../../../cards/domain/specs/AreCardsEqualsSpec';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { CardKind } from '../../../cards/domain/valueObjects/CardKind';
import { ColoredCard } from '../../../cards/domain/valueObjects/ColoredCard';
import { ReverseCard } from '../../../cards/domain/valueObjects/ReverseCard';
import { ActiveGame } from '../entities/ActiveGame';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameService } from '../services/GameService';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameCardSpec } from '../valueObjects/GameCardSpec';
import { GameDirection } from '../valueObjects/GameDirection';

const DRAW_CARDS_TO_DRAW: number = 2;
const SKIP_TURNS_TO_SKIP: number = 1;
const WILD_DRAW_4_CARDS_TO_DRAW: number = 4;

@Injectable()
export class GamePlayCardsUpdateQueryFromGameBuilder
  implements
    Builder<
      GameUpdateQuery,
      [ActiveGame, number[], number, CardColor | undefined]
    >
{
  readonly #areCardsEqualsSpec: AreCardsEqualsSpec;
  readonly #gameService: GameService;

  constructor(
    @Inject(AreCardsEqualsSpec)
    areCardsEqualsSpec: AreCardsEqualsSpec,
    @Inject(GameService)
    gameService: GameService,
  ) {
    this.#areCardsEqualsSpec = areCardsEqualsSpec;
    this.#gameService = gameService;
  }

  public build(
    game: ActiveGame,
    cardIndexes: number[],
    slotIndex: number,
    colorChoice: CardColor | undefined,
  ): GameUpdateQuery {
    const gameSlot: ActiveGameSlot = this.#gameService.getGameSlotOrThrow(
      game,
      slotIndex,
    );

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
          cards: gameSlot.cards.filter(
            (_: Card, index: number): boolean => !cardIndexes.includes(index),
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

    this.#setPlayCardsGameUpdateQueryDrawCount(
      game,
      gameUpdateQuery,
      nextCurrentCard,
      cardIndexes.length,
    );

    this.#setPlayCardsGameUpdateQueryDirection(
      game,
      gameUpdateQuery,
      nextCurrentCard,
      cardIndexes.length,
    );

    this.#setPlayCardsGameUpdateQuerySkipCount(
      gameUpdateQuery,
      nextCurrentCard,
      cardIndexes.length,
    );

    return gameUpdateQuery;
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

  #getReverseDirection(direction: GameDirection): GameDirection {
    switch (direction) {
      case GameDirection.antiClockwise:
        return GameDirection.clockwise;
      case GameDirection.clockwise:
        return GameDirection.antiClockwise;
    }
  }

  #isColored(card: Card): card is Card & ColoredCard {
    return (card as ColoredCard).color !== undefined;
  }

  #isReverse(card: Card): card is ReverseCard {
    return card.kind === CardKind.reverse;
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

  #setPlayCardsGameUpdateQueryDrawCount(
    game: ActiveGame,
    gameUpdateQuery: GameUpdateQuery,
    nextCurrentCard: Card,
    cardsAmount: number,
  ): void {
    switch (nextCurrentCard.kind) {
      case CardKind.draw:
        gameUpdateQuery.drawCount =
          game.state.drawCount + DRAW_CARDS_TO_DRAW * cardsAmount;
        break;
      case CardKind.wildDraw4:
        gameUpdateQuery.drawCount =
          game.state.drawCount + WILD_DRAW_4_CARDS_TO_DRAW * cardsAmount;
        break;
      default:
    }
  }

  #setPlayCardsGameUpdateQueryDirection(
    game: ActiveGame,
    gameUpdateQuery: GameUpdateQuery,
    nextCurrentCard: Card,
    cardsAmount: number,
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const isOddNumberCards: boolean = cardsAmount % 2 !== 0;

    if (this.#isReverse(nextCurrentCard) && isOddNumberCards) {
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

  #setPlayCardsGameUpdateQuerySkipCount(
    gameUpdateQuery: GameUpdateQuery,
    nextCurrentCard: Card,
    cardsAmount: number,
  ): void {
    if (nextCurrentCard.kind === CardKind.skip) {
      gameUpdateQuery.skipCount = SKIP_TURNS_TO_SKIP * cardsAmount;
    }
  }
}
