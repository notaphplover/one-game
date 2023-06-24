import { models as apiModels } from '@cornie-js/api-models';

export class GameOptionsV1Fixtures {
  public static get any(): apiModels.GameOptionsV1 {
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
}
