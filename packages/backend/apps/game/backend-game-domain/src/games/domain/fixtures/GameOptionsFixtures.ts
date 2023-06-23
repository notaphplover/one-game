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
}
