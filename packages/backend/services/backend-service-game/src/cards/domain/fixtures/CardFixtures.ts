import { BlankCard } from '../models/BlankCard';
import { Card } from '../models/Card';
import { CardColor } from '../models/CardColor';
import { CardKind } from '../models/CardKind';
import { DrawCard } from '../models/DrawCard';
import { NormalCard } from '../models/NormalCard';
import { ReverseCard } from '../models/ReverseCard';
import { SkipCard } from '../models/SkipCard';
import { WildCard } from '../models/WildCard';
import { WildDraw4Card } from '../models/WildDraw4Card';

export class CardFixtures {
  public static get any(): Card {
    const fixture: Card = {
      kind: CardKind.wildDraw4,
    };

    return fixture;
  }

  public static get blankCard(): BlankCard {
    return {
      kind: CardKind.blank,
    };
  }

  public static get drawCard(): DrawCard {
    return {
      color: CardColor.blue,
      kind: CardKind.draw,
    };
  }

  public static get normalCard(): NormalCard {
    return {
      color: CardColor.blue,
      kind: CardKind.normal,
      number: 2,
    };
  }

  public static get reverseCard(): ReverseCard {
    return {
      color: CardColor.blue,
      kind: CardKind.reverse,
    };
  }

  public static get skipCard(): SkipCard {
    return {
      color: CardColor.blue,
      kind: CardKind.skip,
    };
  }

  public static get wildCard(): WildCard {
    return {
      kind: CardKind.wild,
    };
  }

  public static get wildDraw4Card(): WildDraw4Card {
    return {
      kind: CardKind.wildDraw4,
    };
  }
}
