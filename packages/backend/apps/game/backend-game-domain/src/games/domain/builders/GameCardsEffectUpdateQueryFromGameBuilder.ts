import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { CardKind } from '../../../cards/domain/valueObjects/CardKind';
import { ColoredCard } from '../../../cards/domain/valueObjects/ColoredCard';
import { ReverseCard } from '../../../cards/domain/valueObjects/ReverseCard';
import { ActiveGame } from '../entities/ActiveGame';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameDirection } from '../valueObjects/GameDirection';

const DRAW_CARDS_TO_DRAW: number = 2;
const SKIP_TURNS_TO_SKIP: number = 1;
const WILD_DRAW_4_CARDS_TO_DRAW: number = 4;

@Injectable()
export class GameCardsEffectUpdateQueryFromGameBuilder
  implements
    Builder<GameUpdateQuery, [ActiveGame, Card, number, CardColor | undefined]>
{
  public build(
    game: ActiveGame,
    card: Card,
    cardsAmount: number,
    colorChoice: CardColor | undefined,
  ): GameUpdateQuery {
    const gameUpdateQuery: GameUpdateQuery = {
      gameFindQuery: {
        id: game.id,
        state: {
          currentPlayingSlotIndex: game.state.currentPlayingSlotIndex,
        },
      },
    };

    this.#setPlayCardsGameUpdateQueryColor(gameUpdateQuery, card, colorChoice);

    this.#setPlayCardsGameUpdateQueryDrawCount(
      game,
      gameUpdateQuery,
      card,
      cardsAmount,
    );

    this.#setPlayCardsGameUpdateQueryDirection(
      game,
      gameUpdateQuery,
      card,
      cardsAmount,
    );

    this.#setPlayCardsGameUpdateQuerySkipCount(
      gameUpdateQuery,
      card,
      cardsAmount,
    );

    return gameUpdateQuery;
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
    return (card as Partial<ColoredCard>).color !== undefined;
  }

  #isReverse(card: Card): card is ReverseCard {
    return card.kind === CardKind.reverse;
  }

  #setPlayCardsGameUpdateQueryColor(
    gameUpdateQuery: GameUpdateQuery,
    card: Card,
    colorChoice: CardColor | undefined,
  ): void {
    if (this.#isColored(card)) {
      if (colorChoice !== undefined) {
        throw new AppError(
          AppErrorKind.unprocessableOperation,
          'Operation not allowed. Reason: unexpected color choice when playing these cards',
        );
      }

      gameUpdateQuery.currentColor = card.color;
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
