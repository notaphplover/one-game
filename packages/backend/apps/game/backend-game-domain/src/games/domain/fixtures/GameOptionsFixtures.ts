import { GameOptions } from '../models/GameOptions';

export class GameOptionsFixtures {
  public static get any(): GameOptions {
    return {
      chainDraw2Draw2Cards: false,
      chainDraw2Draw4Cards: false,
      chainDraw4Draw2Cards: false,
      chainDraw4Draw4Cards: false,
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      id: 'e3b54159-a4ef-41fc-994a-20709526bdaf',
      playCardIsMandatory: false,
      playMultipleSameCards: false,
      playWildDraw4IfNoOtherAlternative: true,
    };
  }

  public static get withChainAnyDrawCardsDisabled(): GameOptions {
    return {
      ...GameOptionsFixtures.any,
      chainDraw2Draw2Cards: false,
      chainDraw2Draw4Cards: false,
      chainDraw4Draw2Cards: false,
      chainDraw4Draw4Cards: false,
    };
  }

  public static get withChainAnyDrawCardsEnabled(): GameOptions {
    return {
      ...GameOptionsFixtures.any,
      chainDraw2Draw2Cards: true,
      chainDraw2Draw4Cards: true,
      chainDraw4Draw2Cards: true,
      chainDraw4Draw4Cards: true,
    };
  }

  public static get withPlayCardIsMandatoryDisabled(): GameOptions {
    return {
      ...GameOptionsFixtures.any,
      playCardIsMandatory: false,
    };
  }

  public static get withPlayCardIsMandatoryEnabled(): GameOptions {
    return {
      ...GameOptionsFixtures.any,
      playCardIsMandatory: true,
    };
  }

  public static get withPlayMultipleSameCardsDisabled(): GameOptions {
    return {
      ...GameOptionsFixtures.any,
      playMultipleSameCards: false,
    };
  }

  public static get withPlayMultipleSameCardsEnabled(): GameOptions {
    return {
      ...GameOptionsFixtures.any,
      playMultipleSameCards: true,
    };
  }
}
