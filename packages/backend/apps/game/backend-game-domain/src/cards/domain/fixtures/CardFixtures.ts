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

  public static get drawBlueCard(): DrawCard {
    return {
      color: CardColor.blue,
      kind: CardKind.draw,
    };
  }

  public static get drawRedCard(): DrawCard {
    return {
      color: CardColor.red,
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

  public static get normalBlueCard(): NormalCard {
    return {
      color: CardColor.blue,
      kind: CardKind.normal,
      number: 2,
    };
  }

  public static get normalBlueTwoCard(): NormalCard {
    return {
      color: CardColor.blue,
      kind: CardKind.normal,
      number: 2,
    };
  }

  public static get normalBlueSevenCard(): NormalCard {
    return {
      color: CardColor.blue,
      kind: CardKind.normal,
      number: 7,
    };
  }

  public static get normalRedCard(): NormalCard {
    return {
      color: CardColor.red,
      kind: CardKind.normal,
      number: 2,
    };
  }

  public static get normalRedTwoCard(): NormalCard {
    return {
      color: CardColor.red,
      kind: CardKind.normal,
      number: 2,
    };
  }

  public static get normalRedSevenCard(): NormalCard {
    return {
      color: CardColor.red,
      kind: CardKind.normal,
      number: 7,
    };
  }

  public static get reverseCard(): ReverseCard {
    return {
      color: CardColor.blue,
      kind: CardKind.reverse,
    };
  }

  public static get reverseBlueCard(): ReverseCard {
    return {
      color: CardColor.blue,
      kind: CardKind.reverse,
    };
  }

  public static get reverseRedCard(): ReverseCard {
    return {
      color: CardColor.red,
      kind: CardKind.reverse,
    };
  }

  public static get skipCard(): SkipCard {
    return {
      color: CardColor.blue,
      kind: CardKind.skip,
    };
  }

  public static get skipBlueCard(): SkipCard {
    return {
      color: CardColor.blue,
      kind: CardKind.skip,
    };
  }

  public static get skipRedCard(): SkipCard {
    return {
      color: CardColor.red,
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
