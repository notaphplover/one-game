import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { GameInitialSnapshotSlotCreateQuery } from '../query/GameInitialSnapshotSlotCreateQuery';

export class GameInitialSnapshotSlotCreateQueryFixtures {
  public static get any(): GameInitialSnapshotSlotCreateQuery {
    return {
      cards: [],
      gameInitialSnapshotId: '83073aec-b81b-4107-97f9-baa46de5dd41',
      id: 'ea7ea510-6588-4c1e-a58f-fed69c60c4a1',
      position: 0,
      userId: 'c86b6e87-f33f-422f-9477-265400d87c0a',
    };
  }

  public static get withCardsOne(): GameInitialSnapshotSlotCreateQuery {
    return {
      ...GameInitialSnapshotSlotCreateQueryFixtures.any,
      cards: [CardFixtures.any],
    };
  }
}
