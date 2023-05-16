import { CardColor } from '@cornie-js/backend-app-game-models/cards/domain';
import { Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { CardColorDb } from '../models/CardColorDb';
import {
  CARD_V1_MASK,
  COLORED_BLUE_SUBTYPE_MASK,
  COLORED_GREEN_SUBTYPE_MASK,
  COLORED_RED_SUBTYPE_MASK,
  COLORED_YELLOW_SUBTYPE_MASK,
} from '../models/cardDbMasks';

@Injectable()
export class CardColorDbBuilder implements Builder<CardColorDb, [CardColor]> {
  public build(cardColor: CardColor): CardColorDb {
    let cardColorDb: CardColorDb = CARD_V1_MASK;

    switch (cardColor) {
      case CardColor.blue:
        cardColorDb |= COLORED_BLUE_SUBTYPE_MASK;
        break;
      case CardColor.green:
        cardColorDb |= COLORED_GREEN_SUBTYPE_MASK;
        break;
      case CardColor.red:
        cardColorDb |= COLORED_RED_SUBTYPE_MASK;
        break;
      case CardColor.yellow:
        cardColorDb |= COLORED_YELLOW_SUBTYPE_MASK;
        break;
    }

    return cardColorDb;
  }
}
