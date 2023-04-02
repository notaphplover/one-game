import { Injectable } from '@nestjs/common';
import { AppError, AppErrorKind, Builder } from '@one-game-js/backend-common';

import { CardColor } from '../../../domain/models/CardColor';
import { CardColorDb } from '../models/CardColorDb';
import {
  CARD_COLOR_SUBTYPE,
  CARD_V1_MASK,
  CARD_VERSION_MASK,
  COLORED_BLUE_SUBTYPE_MASK,
  COLORED_GREEN_SUBTYPE_MASK,
  COLORED_RED_SUBTYPE_MASK,
  COLORED_YELLOW_SUBTYPE_MASK,
} from '../models/cardDbMasks';

@Injectable()
export class CardColorBuilder implements Builder<CardColor, [CardColorDb]> {
  public build(cardColorDb: CardColorDb): CardColor {
    let cardColor: CardColor;

    const cardVersion: number = cardColorDb & CARD_VERSION_MASK;

    switch (cardVersion) {
      case CARD_V1_MASK:
        cardColor = this.#buildCardColorV1(cardColorDb);
        break;
      default:
        throw new AppError(
          AppErrorKind.unknown,
          `Unexpected card version ${cardVersion}`,
        );
    }

    return cardColor;
  }

  #buildCardColorV1(cardColorDb: CardColorDb): CardColor {
    const cardColorNumber: number = cardColorDb & CARD_COLOR_SUBTYPE;

    let cardColor: CardColor;

    switch (cardColorNumber) {
      case COLORED_BLUE_SUBTYPE_MASK:
        cardColor = CardColor.blue;
        break;
      case COLORED_GREEN_SUBTYPE_MASK:
        cardColor = CardColor.green;
        break;
      case COLORED_RED_SUBTYPE_MASK:
        cardColor = CardColor.red;
        break;
      case COLORED_YELLOW_SUBTYPE_MASK:
        cardColor = CardColor.yellow;
        break;
      default:
        throw new AppError(
          AppErrorKind.unknown,
          `Unexpected card color ${cardColorNumber}`,
        );
    }

    return cardColor;
  }
}
