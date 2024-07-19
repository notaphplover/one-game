import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Card } from '../valueObjects/Card';
import { ColoredCard } from '../valueObjects/ColoredCard';

@Injectable()
export class CardRequiresColorChoiceSpec implements Spec<[Card]> {
  public isSatisfiedBy(card: Card): boolean {
    return !this.#isColored(card);
  }

  #isColored(card: Card): card is Card & ColoredCard {
    return (card as ColoredCard).color !== undefined;
  }
}
