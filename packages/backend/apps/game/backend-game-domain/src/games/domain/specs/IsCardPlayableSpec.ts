import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Card } from '../../../cards/domain/models/Card';
import { CardKind } from '../../../cards/domain/models/CardKind';
import { DrawCard } from '../../../cards/domain/models/DrawCard';
import { NormalCard } from '../../../cards/domain/models/NormalCard';
import { ReverseCard } from '../../../cards/domain/models/ReverseCard';
import { SkipCard } from '../../../cards/domain/models/SkipCard';
import { ActiveGame } from '../models/ActiveGame';
import { GameOptions } from '../models/GameOptions';

@Injectable()
export class IsCardPlayableSpec
  implements Spec<[Card, ActiveGame, GameOptions]>
{
  public isSatisfiedBy(
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
      case CardKind.blank:
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
