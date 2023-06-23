import { Writable } from '@cornie-js/backend-common';

import { GameOptionsDb } from '../models/GameOptionsDb';

export class GameOptionsDbFixtures {
  public static get any(): GameOptionsDb {
    const fixture: Writable<GameOptionsDb> = new GameOptionsDb();

    fixture.chainDraw2Draw2Cards = false;
    fixture.chainDraw2Draw4Cards = false;
    fixture.chainDraw4Draw2Cards = false;
    fixture.chainDraw4Draw4Cards = false;
    fixture.gameId = 'e6b54159-a4ef-41fc-994a-20709526bdaa';
    fixture.id = 'e3b54159-a4ef-41fc-994a-20709526bdaf';
    fixture.playCardIsMandatory = false;
    fixture.playMultipleSameCards = false;
    fixture.playWildDraw4IfNoOtherAlternative = true;

    return fixture;
  }
}
