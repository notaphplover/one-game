import { models as apiModels } from '@one-game-js/api-models';

export class CardV1Fixtures {
  public static get blankCard(): apiModels.BlankCardV1 {
    return {
      kind: 'blank',
    };
  }

  public static get drawCard(): apiModels.DrawCardV1 {
    return {
      color: 'blue',
      kind: 'draw',
    };
  }

  public static get normalCard(): apiModels.NormalCardV1 {
    return {
      color: 'blue',
      kind: 'normal',
      number: 2,
    };
  }

  public static get reverseCard(): apiModels.ReverseCardV1 {
    return {
      color: 'blue',
      kind: 'reverse',
    };
  }

  public static get skipCard(): apiModels.SkipCardV1 {
    return {
      color: 'blue',
      kind: 'skip',
    };
  }

  public static get wildCard(): apiModels.WildCardV1 {
    return {
      kind: 'wild',
    };
  }

  public static get wildDraw4Card(): apiModels.WildDraw4CardV1 {
    return {
      kind: 'wildDraw4',
    };
  }
}
