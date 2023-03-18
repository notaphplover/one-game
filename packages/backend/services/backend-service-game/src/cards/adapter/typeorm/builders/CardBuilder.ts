import { AppError, AppErrorKind, Builder } from '@one-game-js/backend-common';

import { BlankCard } from '../../../domain/models/BlankCard';
import { Card } from '../../../domain/models/Card';
import { CardKind } from '../../../domain/models/CardKind';
import { DrawCard } from '../../../domain/models/DrawCard';
import { NormalCard } from '../../../domain/models/NormalCard';
import { ReverseCard } from '../../../domain/models/ReverseCard';
import { SkipCard } from '../../../domain/models/SkipCard';
import { WildCard } from '../../../domain/models/WildCard';
import { WildDraw4Card } from '../../../domain/models/WildDraw4Card';
import { CardDb } from '../models/CardDb';
import {
  CARD_COLOR_SUBTYPE,
  CARD_IS_NUMBERED_SUBTYPE,
  CARD_TYPE_MASK,
  CARD_V1_MASK,
  CARD_VALUE_MASK,
  CARD_VERSION_MASK,
  COLORED_CARD_TYPE_MASK,
  NON_COLORED_BLANK_VALUE_MASK,
  NON_COLORED_WILD_DRAW_4_VALUE_MASK,
  NON_COLORED_WILD_VALUE_MASK,
  UNCOLORED_CARD_TYPE_MASK,
} from '../models/cardDbMasks';

export class CardBuilder implements Builder<Card, [CardDb]> {
  public build(cardDb: number): Card {
    let card: Card;

    const cardVersion: number = cardDb & CARD_VERSION_MASK;

    switch (cardVersion) {
      case CARD_V1_MASK:
        card = this.#buildCardV1(cardDb);
        break;
      default:
        throw new AppError(
          AppErrorKind.unknown,
          `Unexpected card version ${cardVersion}`,
        );
    }

    return card;
  }

  #buildCardV1(cardDb: number): Card {
    let card: Card;

    const cardType: number = cardDb & CARD_TYPE_MASK;

    switch (cardType) {
      case COLORED_CARD_TYPE_MASK:
        card = this.#buildColoredCardV1(cardDb);
        break;
      case UNCOLORED_CARD_TYPE_MASK:
        card = this.#buildUncoloredCardV1(cardDb);
        break;

      default:
        throw new AppError(
          AppErrorKind.unknown,
          `Unexpected card type ${cardType}`,
        );
    }

    return card;
  }

  #buildColoredCardV1(
    cardDb: number,
  ): DrawCard | NormalCard | ReverseCard | SkipCard {
    const cardIsNumbered: number = cardDb & CARD_IS_NUMBERED_SUBTYPE;
    const cardColor: number = cardDb & CARD_COLOR_SUBTYPE;
  }

  #buildUncoloredCardV1(cardDb: number): BlankCard | WildCard | WildDraw4Card {
    let card: BlankCard | WildCard | WildDraw4Card;

    const cardValue: number = cardDb & CARD_VALUE_MASK;

    switch (cardValue) {
      case NON_COLORED_BLANK_VALUE_MASK:
        card = {
          kind: CardKind.blank,
        };
        break;
      case NON_COLORED_WILD_VALUE_MASK:
        card = {
          kind: CardKind.wild,
        };
        break;
      case NON_COLORED_WILD_DRAW_4_VALUE_MASK:
        card = {
          kind: CardKind.wildDraw4,
        };
        break;
      default:
        throw new AppError(
          AppErrorKind.unknown,
          `Unexpected card value ${cardValue}`,
        );
    }

    return card;
  }
}
