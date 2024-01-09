import { GameOptions } from '../valueObjects/GameOptions';

export class GameOptionsFixtures {
  public static get any(): GameOptions {
    return {
      chainDraw2Draw2Cards: false,
      chainDraw2Draw4Cards: false,
      chainDraw4Draw2Cards: false,
      chainDraw4Draw4Cards: false,
      playCardIsMandatory: false,
      playMultipleSameCards: false,
      playWildDraw4IfNoOtherAlternative: true,
    };
  }

  public static get withChainAnyDrawCardsDisabledAndPlayWildDraw4IfNoOtherAlternativeDisabled(): GameOptions {
    return {
      ...GameOptionsFixtures.any,
      chainDraw2Draw2Cards: false,
      chainDraw2Draw4Cards: false,
      chainDraw4Draw2Cards: false,
      chainDraw4Draw4Cards: false,
      playWildDraw4IfNoOtherAlternative: false,
    };
  }

  public static get withChainAnyDrawCardsEnabledAndPlayWildDraw4IfNoOtherAlternativeDisabled(): GameOptions {
    return {
      ...GameOptionsFixtures.any,
      chainDraw2Draw2Cards: true,
      chainDraw2Draw4Cards: true,
      chainDraw4Draw2Cards: true,
      chainDraw4Draw4Cards: true,
      playWildDraw4IfNoOtherAlternative: false,
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

  public static get withPlayWildDraw4IfNoOtherAlternativeDisabled(): GameOptions {
    return {
      ...GameOptionsFixtures.any,
      playWildDraw4IfNoOtherAlternative: false,
    };
  }

  public static get withPlayWildDraw4IfNoOtherAlternativeEnabled(): GameOptions {
    return {
      ...GameOptionsFixtures.any,
      playWildDraw4IfNoOtherAlternative: true,
    };
  }
}
