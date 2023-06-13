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
} from '@cornie-js/backend-app-game-domain/cards/domain';

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
