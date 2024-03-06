import {
  AppError,
  AppErrorKind,
  Builder,
  Writable,
} from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { AreCardsEqualsSpec } from '../../../cards/domain/specs/AreCardsEqualsSpec';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { ActiveGame } from '../entities/ActiveGame';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameService } from '../services/GameService';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameCardSpec } from '../valueObjects/GameCardSpec';

@Injectable()
export class GamePlayCardsUpdateQueryFromGameBuilder
  implements Builder<GameUpdateQuery, [ActiveGame, number[], number]>
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
      currentTurnCardsPlayed: true,
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
}
