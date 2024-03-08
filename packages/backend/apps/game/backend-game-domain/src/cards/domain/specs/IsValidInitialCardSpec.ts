import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Card } from '../valueObjects/Card';
import { CardKind } from '../valueObjects/CardKind';

@Injectable()
export class IsValidInitialCardSpec implements Spec<[Card]> {
  public isSatisfiedBy(card: Card): boolean {
    return card.kind !== CardKind.wildDraw4;
  }
}
