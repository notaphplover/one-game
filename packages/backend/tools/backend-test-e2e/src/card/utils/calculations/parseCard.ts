import { models as apiModels } from '@cornie-js/api-models';
import {
  Card,
  CardColor,
  CardKind,
} from '@cornie-js/backend-game-domain/cards';

const WILD_DRAW_4_CARD: string = 'WD';
const WILD_CARD: string = 'W';

const DRAW_CARD_KIND: string = 'D';
const SKIP_CARD_KIND: string = 'S';
const REVERSE_CARD_KIND: string = 'R';

const BLUE_COLOR: string = 'b';
const GREEN_COLOR: string = 'g';
const RED_COLOR: string = 'r';
const YELLOW_COLOR: string = 'y';

function parseCardColor(
  stringifiedCardColor: string | undefined,
): [CardColor, apiModels.CardColorV1] {
  switch (stringifiedCardColor) {
    case BLUE_COLOR:
      return [CardColor.blue, 'blue'];
    case GREEN_COLOR:
      return [CardColor.green, 'green'];
    case RED_COLOR:
      return [CardColor.red, 'red'];
    case YELLOW_COLOR:
      return [CardColor.yellow, 'yellow'];
    default:
      throw new Error(
        `Unexpected card color "${stringifiedCardColor ?? 'unknown'}"`,
      );
  }
}

export function parseCard(stringifiedCard: string): [Card, apiModels.CardV1] {
  if (stringifiedCard === WILD_CARD) {
    return [
      {
        kind: CardKind.wild,
      },
      {
        kind: 'wild',
      },
    ];
  }
  if (stringifiedCard === WILD_DRAW_4_CARD) {
    return [
      {
        kind: CardKind.wildDraw4,
      },
      {
        kind: 'wildDraw4',
      },
    ];
  }

  const [stringifiedCardKind, stringifiedCardColor]: string = stringifiedCard;

  const [cardColor, cardColorV1]: [CardColor, apiModels.CardColorV1] =
    parseCardColor(stringifiedCardColor);

  switch (stringifiedCardKind) {
    case DRAW_CARD_KIND:
      return [
        {
          color: cardColor,
          kind: CardKind.draw,
        },
        {
          color: cardColorV1,
          kind: 'draw',
        },
      ];
    case SKIP_CARD_KIND:
      return [
        {
          color: cardColor,
          kind: CardKind.skip,
        },
        {
          color: cardColorV1,
          kind: 'skip',
        },
      ];
    case REVERSE_CARD_KIND: {
      return [
        {
          color: cardColor,
          kind: CardKind.reverse,
        },
        {
          color: cardColorV1,
          kind: 'reverse',
        },
      ];
    }
    default: {
      if (stringifiedCardKind === undefined) {
        throw new Error('Unexpected undefined card kind');
      }

      const cardNumber: number = parseInt(stringifiedCardKind);

      if (Number.isNaN(cardNumber)) {
        throw new Error('Unexpected card number');
      }

      return [
        {
          color: cardColor,
          kind: CardKind.normal,
          number: cardNumber,
        },
        {
          color: cardColorV1,
          kind: 'normal',
          number: cardNumber,
        },
      ];
    }
  }
}
