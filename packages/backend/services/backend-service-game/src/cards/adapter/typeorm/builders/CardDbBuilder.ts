import { Injectable } from '@nestjs/common';
import { Builder } from '@one-game-js/backend-common';

import { BaseCard } from '../../../domain/models/BaseCard';
import { BlankCard } from '../../../domain/models/BlankCard';
import { Card } from '../../../domain/models/Card';
import { CardColor } from '../../../domain/models/CardColor';
import { CardKind } from '../../../domain/models/CardKind';
import { ColoredCard } from '../../../domain/models/ColoredCard';
import { DrawCard } from '../../../domain/models/DrawCard';
import { NormalCard } from '../../../domain/models/NormalCard';
import { ReverseCard } from '../../../domain/models/ReverseCard';
import { SkipCard } from '../../../domain/models/SkipCard';
import { WildCard } from '../../../domain/models/WildCard';
import { WildDraw4Card } from '../../../domain/models/WildDraw4Card';
import { CardDb } from '../models/CardDb';
import {
  COLORED_BLUE_SUBTYPE_MASK,
  COLORED_CARD_TYPE_MASK,
  COLORED_GREEN_SUBTYPE_MASK,
  COLORED_NON_NUMBERED_DRAW_VALUE_MASK,
  COLORED_NON_NUMBERED_REVERSE_VALUE_MASK,
  COLORED_NON_NUMBERED_SKIP_VALUE_MASK,
  COLORED_NON_NUMBERED_SUBTYPE_MASK,
  COLORED_NUMBERED_SUBTYPE_MASK,
  COLORED_RED_SUBTYPE_MASK,
  COLORED_YELLOW_SUBTYPE_MASK,
  NON_COLORED_BLANK_VALUE_MASK,
  NON_COLORED_WILD_DRAW_4_VALUE_MASK,
  NON_COLORED_WILD_VALUE_MASK,
  UNCOLORED_CARD_TYPE_MASK,
  CARD_V1_MASK,
} from '../models/cardDbMasks';

@Injectable()
export class CardDbBuilder implements Builder<CardDb, [Card]> {
  public build(card: Card): number {
    let cardDbBits: number = CARD_V1_MASK;

    if (this.#isColored(card)) {
      cardDbBits |= this.#buildColoredCardDbRemainingBits(card);
    } else {
      cardDbBits |= this.#buildNonColoredCardDbRemainingBits(card);
    }

    return cardDbBits;
  }

  #buildColorCardDbRemainingBits(cardColor: CardColor): number {
    switch (cardColor) {
      case CardColor.blue:
        return COLORED_BLUE_SUBTYPE_MASK;
      case CardColor.green:
        return COLORED_GREEN_SUBTYPE_MASK;
      case CardColor.red:
        return COLORED_RED_SUBTYPE_MASK;
      case CardColor.yellow:
        return COLORED_YELLOW_SUBTYPE_MASK;
    }
  }

  #buildColoredCardDbRemainingBits(
    card: DrawCard | NormalCard | ReverseCard | SkipCard,
  ): number {
    let cardDbBits: number =
      COLORED_CARD_TYPE_MASK | this.#buildColorCardDbRemainingBits(card.color);

    switch (card.kind) {
      case CardKind.draw:
        cardDbBits |=
          COLORED_NON_NUMBERED_SUBTYPE_MASK |
          COLORED_NON_NUMBERED_DRAW_VALUE_MASK;
        break;
      case CardKind.normal:
        cardDbBits |= COLORED_NUMBERED_SUBTYPE_MASK | card.number;
        break;
      case CardKind.reverse:
        cardDbBits |=
          COLORED_NON_NUMBERED_SUBTYPE_MASK |
          COLORED_NON_NUMBERED_REVERSE_VALUE_MASK;
        break;
      case CardKind.skip:
        cardDbBits |=
          COLORED_NON_NUMBERED_SUBTYPE_MASK |
          COLORED_NON_NUMBERED_SKIP_VALUE_MASK;
        break;
    }

    return cardDbBits;
  }

  #buildNonColoredCardDbRemainingBits(
    card: BlankCard | WildCard | WildDraw4Card,
  ): number {
    let cardDbBits: number = UNCOLORED_CARD_TYPE_MASK;

    switch (card.kind) {
      case CardKind.blank:
        cardDbBits |= NON_COLORED_BLANK_VALUE_MASK;
        break;
      case CardKind.wild:
        cardDbBits |= NON_COLORED_WILD_VALUE_MASK;
        break;
      case CardKind.wildDraw4:
        cardDbBits |= NON_COLORED_WILD_DRAW_4_VALUE_MASK;
        break;
    }

    return cardDbBits;
  }

  #isColored(card: BaseCard): card is ColoredCard {
    return (card as ColoredCard).color !== undefined;
  }
}
