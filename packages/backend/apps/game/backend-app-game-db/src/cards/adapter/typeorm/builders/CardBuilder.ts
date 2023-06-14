import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import {
  BlankCard,
  Card,
  CardColor,
  CardKind,
  DrawCard,
  NormalCard,
  ReverseCard,
  SkipCard,
  WildCard,
  WildDraw4Card,
} from '@cornie-js/backend-game-domain/cards';

import { CardDb } from '../models/CardDb';
import {
  CARD_COLOR_SUBTYPE,
  CARD_IS_NUMBERED_SUBTYPE,
  CARD_TYPE_MASK,
  CARD_V1_MASK,
  CARD_VALUE_MASK,
  CARD_VERSION_MASK,
  COLORED_BLUE_SUBTYPE_MASK,
  COLORED_CARD_TYPE_MASK,
  COLORED_GREEN_SUBTYPE_MASK,
  COLORED_NON_NUMBERED_SUBTYPE_MASK,
  COLORED_NUMBERED_SUBTYPE_MASK,
  COLORED_RED_SUBTYPE_MASK,
  COLORED_YELLOW_SUBTYPE_MASK,
  NON_COLORED_BLANK_VALUE_MASK,
  NON_COLORED_WILD_DRAW_4_VALUE_MASK,
  NON_COLORED_WILD_VALUE_MASK,
  UNCOLORED_CARD_TYPE_MASK,
  COLORED_NON_NUMBERED_DRAW_VALUE_MASK,
  COLORED_NON_NUMBERED_SKIP_VALUE_MASK,
  COLORED_NON_NUMBERED_REVERSE_VALUE_MASK,
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

  #buildCardColorV1(cardDb: number): CardColor {
    const cardColorNumber: number = cardDb & CARD_COLOR_SUBTYPE;

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

  #buildColoredCardV1(
    cardDb: number,
  ): DrawCard | NormalCard | ReverseCard | SkipCard {
    const cardIsNumbered: number = cardDb & CARD_IS_NUMBERED_SUBTYPE;

    let card: DrawCard | NormalCard | ReverseCard | SkipCard;

    switch (cardIsNumbered) {
      case COLORED_NON_NUMBERED_SUBTYPE_MASK:
        card = this.#buildColoredNonNumberedCardV1(cardDb);
        break;
      case COLORED_NUMBERED_SUBTYPE_MASK:
        card = this.#buildColoredNumberedCardV1(cardDb);
        break;
      default:
        throw new AppError(
          AppErrorKind.unknown,
          `Unexpected card number flag ${cardIsNumbered}`,
        );
    }

    return card;
  }

  #buildColoredNonNumberedCardV1(
    cardDb: number,
  ): DrawCard | ReverseCard | SkipCard {
    let card: DrawCard | ReverseCard | SkipCard;

    const cardColor: CardColor = this.#buildCardColorV1(cardDb);
    const cardValue: number = cardDb & CARD_VALUE_MASK;

    switch (cardValue) {
      case COLORED_NON_NUMBERED_DRAW_VALUE_MASK:
        card = {
          color: cardColor,
          kind: CardKind.draw,
        };
        break;
      case COLORED_NON_NUMBERED_REVERSE_VALUE_MASK:
        card = {
          color: cardColor,
          kind: CardKind.reverse,
        };
        break;
      case COLORED_NON_NUMBERED_SKIP_VALUE_MASK:
        card = {
          color: cardColor,
          kind: CardKind.skip,
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

  #buildColoredNumberedCardV1(cardDb: number): NormalCard {
    const cardColor: CardColor = this.#buildCardColorV1(cardDb);
    const cardValue: number = cardDb & CARD_VALUE_MASK;

    return {
      color: cardColor,
      kind: CardKind.normal,
      number: cardValue,
    };
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
