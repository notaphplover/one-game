import { AppError, AppErrorKind, Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardKind } from '../../../cards/domain/valueObjects/CardKind';
import { DrawCard } from '../../../cards/domain/valueObjects/DrawCard';
import { NormalCard } from '../../../cards/domain/valueObjects/NormalCard';
import { ReverseCard } from '../../../cards/domain/valueObjects/ReverseCard';
import { SkipCard } from '../../../cards/domain/valueObjects/SkipCard';
import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameOptions } from '../valueObjects/GameOptions';

@Injectable()
export class CardCanBePlayedSpec
  implements Spec<[Card, ActiveGame, GameOptions]>
{
  public isSatisfiedBy(
    card: Card,
    game: ActiveGame,
    gameOptions: GameOptions,
  ): boolean {
    const cardCanBePlayedBasedOnTheCurrentCard: boolean =
      this.#isCardPlayableBasedOnTheCurrentCard(card, game, gameOptions);

    return (
      cardCanBePlayedBasedOnTheCurrentCard &&
      (!gameOptions.playWildDraw4IfNoOtherAlternative ||
        card.kind !== CardKind.wildDraw4 ||
        !this.#isAnyNonWildCardDraw4Playable(game, gameOptions))
    );
  }

  #getActiveGameSlotOrThrow(game: ActiveGame): ActiveGameSlot {
    const slotIndex: number = game.state.currentPlayingSlotIndex;
    const activeGameSlot: ActiveGameSlot | undefined =
      game.state.slots[slotIndex];

    if (activeGameSlot === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `Game slot at position "${slotIndex.toString()}" not found for game "${game.id}"`,
      );
    }

    return activeGameSlot;
  }

  #isAnyNonWildCardDraw4Playable(
    game: ActiveGame,
    gameOptions: GameOptions,
  ): boolean {
    const currentActiveGameSlot: ActiveGameSlot =
      this.#getActiveGameSlotOrThrow(game);

    const nonWildDraw4Cards: Card[] = currentActiveGameSlot.cards.filter(
      (card: Card) => card.kind !== CardKind.wildDraw4,
    );

    return nonWildDraw4Cards.some((card: Card) =>
      this.isSatisfiedBy(card, game, gameOptions),
    );
  }

  #isCardPlayableBasedOnTheCurrentCard(
    card: Card,
    game: ActiveGame,
    gameOptions: GameOptions,
  ): boolean {
    const cardFulfillsColorConstraint: (card: Card) => boolean = (
      card: Card,
    ): boolean =>
      !this.#isColoredCard(card) || game.state.currentColor === card.color;

    switch (game.state.currentCard.kind) {
      case CardKind.draw:
        return game.state.drawCount > 0
          ? (gameOptions.chainDraw2Draw2Cards && card.kind === CardKind.draw) ||
              (gameOptions.chainDraw2Draw4Cards &&
                card.kind === CardKind.wildDraw4)
          : game.state.currentCard.kind === card.kind ||
              cardFulfillsColorConstraint(card);
      case CardKind.wildDraw4:
        return game.state.drawCount > 0
          ? (gameOptions.chainDraw4Draw2Cards &&
              card.kind === CardKind.draw &&
              game.state.currentColor === card.color) ||
              (gameOptions.chainDraw4Draw4Cards &&
                card.kind === CardKind.wildDraw4)
          : cardFulfillsColorConstraint(card);
      case CardKind.normal: {
        return card.kind === CardKind.normal
          ? game.state.currentColor === card.color ||
              game.state.currentCard.number === card.number
          : cardFulfillsColorConstraint(card);
      }
      case CardKind.reverse:
      case CardKind.skip:
        return (
          game.state.currentCard.kind === card.kind ||
          cardFulfillsColorConstraint(card)
        );
      case CardKind.wild:
        return cardFulfillsColorConstraint(card);
    }
  }

  #isColoredCard(
    card: Card,
  ): card is DrawCard | NormalCard | ReverseCard | SkipCard {
    return (
      card.kind === CardKind.draw ||
      card.kind === CardKind.normal ||
      card.kind === CardKind.reverse ||
      card.kind === CardKind.skip
    );
  }
}
