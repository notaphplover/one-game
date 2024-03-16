import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { Card } from '../../../cards/domain/valueObjects/Card';
import { ActiveGame } from '../entities/ActiveGame';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameDrawService } from '../services/GameDrawService';
import { GameService } from '../services/GameService';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameCardSpec } from '../valueObjects/GameCardSpec';
import { CardsFromActiveGameSlotBuilder } from './CardsFromActiveGameSlotBuilder';

@Injectable()
export class GamePlayCardsUpdateQueryFromGameBuilder
  implements Builder<GameUpdateQuery, [ActiveGame, number[], number]>
{
  readonly #cardsFromActiveGameSlotBuilder: Builder<
    Card[],
    [ActiveGameSlot, number[]]
  >;
  readonly #gameDrawService: GameDrawService;
  readonly #gameService: GameService;

  constructor(
    @Inject(CardsFromActiveGameSlotBuilder)
    cardsFromActiveGameSlotBuilder: Builder<Card[], [ActiveGameSlot, number[]]>,
    @Inject(GameDrawService)
    gameDrawService: GameDrawService,
    @Inject(GameService)
    gameService: GameService,
  ) {
    this.#cardsFromActiveGameSlotBuilder = cardsFromActiveGameSlotBuilder;
    this.#gameDrawService = gameDrawService;
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

    this.#gameDrawService.putCards(nextDiscardPile, nextCurrentCards);

    return nextDiscardPile;
  }

  #getPlayCardsGameUpdateQueryNextCurrentCard(
    gameSlot: ActiveGameSlot,
    cardIndexes: number[],
  ): [Card, ...Card[]] {
    const nextCurrentCards: Card[] = this.#cardsFromActiveGameSlotBuilder.build(
      gameSlot,
      cardIndexes,
    );

    if (nextCurrentCards[0] === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        'An unexpected error happened while attempting to update game',
      );
    }

    return nextCurrentCards as [Card, ...Card[]];
  }
}
