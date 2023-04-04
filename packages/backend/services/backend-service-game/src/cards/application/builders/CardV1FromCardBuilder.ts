import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import { Card } from '../../domain/models/Card';
import { CardColor } from '../../domain/models/CardColor';
import { CardKind } from '../../domain/models/CardKind';
import { CardColorV1FromCardColorBuilder } from './CardColorV1FromCardColorBuilder';

@Injectable()
export class CardV1FromCardBuilder
  implements Builder<apiModels.CardV1, [Card]>
{
  readonly #cardColorV1FromCardColorBuilder: Builder<
    apiModels.CardColorV1,
    [CardColor]
  >;

  constructor(
    @Inject(CardColorV1FromCardColorBuilder)
    cardColorV1FromCardColorBuilder: Builder<
      apiModels.CardColorV1,
      [CardColor]
    >,
  ) {
    this.#cardColorV1FromCardColorBuilder = cardColorV1FromCardColorBuilder;
  }

  public build(card: Card): apiModels.CardV1 {
    let cardV1: apiModels.CardV1;

    switch (card.kind) {
      case CardKind.blank:
        cardV1 = {
          kind: 'blank',
        };
        break;
      case CardKind.draw:
        cardV1 = {
          color: this.#cardColorV1FromCardColorBuilder.build(card.color),
          kind: 'draw',
        };
        break;
      case CardKind.normal:
        cardV1 = {
          color: this.#cardColorV1FromCardColorBuilder.build(card.color),
          kind: 'normal',
          number: card.number,
        };
        break;
      case CardKind.reverse:
        cardV1 = {
          color: this.#cardColorV1FromCardColorBuilder.build(card.color),
          kind: CardKind.reverse,
        };
        break;
      case CardKind.skip:
        cardV1 = {
          color: this.#cardColorV1FromCardColorBuilder.build(card.color),
          kind: 'skip',
        };
        break;
      case CardKind.wild:
        cardV1 = {
          kind: 'wild',
        };
        break;
      case CardKind.wildDraw4:
        cardV1 = {
          kind: 'wildDraw4',
        };
        break;
    }

    return cardV1;
  }
}
