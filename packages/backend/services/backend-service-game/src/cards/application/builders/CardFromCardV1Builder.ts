import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { Card } from '../../domain/models/Card';
import { CardColor } from '../../domain/models/CardColor';
import { CardKind } from '../../domain/models/CardKind';
import { CardColorFromCardColorV1Builder } from './CardColorFromCardColorV1Builder';

@Injectable()
export class CardFromCardV1Builder
  implements Builder<Card, [apiModels.CardV1]>
{
  readonly #cardColorFromCardColorV1Builder: Builder<
    CardColor,
    [apiModels.CardColorV1]
  >;

  constructor(
    @Inject(CardColorFromCardColorV1Builder)
    cardColorFromCardColorV1Builder: Builder<
      CardColor,
      [apiModels.CardColorV1]
    >,
  ) {
    this.#cardColorFromCardColorV1Builder = cardColorFromCardColorV1Builder;
  }

  public build(cardV1: apiModels.CardV1): Card {
    let card: Card;

    switch (cardV1.kind) {
      case 'blank':
        card = {
          kind: CardKind.blank,
        };
        break;
      case 'draw':
        card = {
          color: this.#cardColorFromCardColorV1Builder.build(cardV1.color),
          kind: CardKind.draw,
        };
        break;
      case 'normal':
        card = {
          color: this.#cardColorFromCardColorV1Builder.build(cardV1.color),
          kind: CardKind.normal,
          number: cardV1.number,
        };
        break;
      case 'reverse':
        card = {
          color: this.#cardColorFromCardColorV1Builder.build(cardV1.color),
          kind: CardKind.reverse,
        };
        break;
      case 'skip':
        card = {
          color: this.#cardColorFromCardColorV1Builder.build(cardV1.color),
          kind: CardKind.skip,
        };
        break;
      case 'wild':
        card = {
          kind: CardKind.wild,
        };
        break;
      case 'wildDraw4':
        card = {
          kind: CardKind.wildDraw4,
        };
        break;
    }

    return card;
  }
}
