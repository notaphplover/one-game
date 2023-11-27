import { Writable } from '@cornie-js/backend-common';

import { GameSpecDb } from '../models/GameSpecDb';

export class GameSpecDbFixtures {
  public static get any(): GameSpecDb {
    const fixture: Writable<GameSpecDb> = new GameSpecDb();

    fixture.cardsSpec = '[{ "amount": 1, "card": 39 }]';
    fixture.chainDraw2Draw2Cards = false;
    fixture.chainDraw2Draw4Cards = false;
    fixture.chainDraw4Draw2Cards = false;
    fixture.chainDraw4Draw4Cards = false;
    fixture.gameId = 'e6b54159-a4ef-41fc-994a-20709526bdaa';
    fixture.gameSlotsAmount = 2;
    fixture.id = 'e3b54159-a4ef-41fc-094a-20709526bdaf';
    fixture.playCardIsMandatory = false;
    fixture.playMultipleSameCards = false;
    fixture.playWildDraw4IfNoOtherAlternative = true;

    return fixture;
  }

  public static get withCardSpecWithOne(): GameSpecDb {
    const fixture: Writable<GameSpecDb> = GameSpecDbFixtures.any;

    fixture.cardsSpec = '[{ "amount": 1, "card": 39 }]';

    return fixture;
  }
}
