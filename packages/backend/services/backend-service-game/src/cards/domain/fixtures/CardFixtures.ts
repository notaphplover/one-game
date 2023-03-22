import { Card } from '../models/Card';
import { CardKind } from '../models/CardKind';

export class CardFixtures {
  public static get any(): Card {
    const fixture: Card = {
      kind: CardKind.wildDraw4,
    };

    return fixture;
  }
}
