import { GameSlotCreateQuery } from '../query/GameSlotCreateQuery';

export class GameSlotCreateQueryFixtures {
  public static get any(): GameSlotCreateQuery {
    const fixture: GameSlotCreateQuery = {
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      id: '0aeea653-4749-4c93-878e-7c6df7f6fe4a',
      position: 0,
      userId: '83073aec-b81b-4107-97f9-baa46de5dd40',
    };

    return fixture;
  }
}
