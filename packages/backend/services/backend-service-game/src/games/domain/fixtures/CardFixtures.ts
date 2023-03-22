import { Card } from '../../../cards/domain/models/Card';
import { CardKind } from '../../../cards/domain/models/CardKind';

export class CardFixtures {
  public static get any(): Card {
    const fixture: Card = {
      kind: CardKind.wildDraw4,
    };

    return fixture;
  }
}
