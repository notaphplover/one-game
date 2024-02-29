import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { GameCardSpecFixtures } from '../../../games/domain/fixtures/GameCardSpecFixtures';
import { GameDirection } from '../../../games/domain/valueObjects/GameDirection';
import { GameInitialSnapshotCreateQuery } from '../query/GameInitialSnapshotCreateQuery';
import { GameInitialSnapshotSlotCreateQueryFixtures } from './GameInitialSnapshotSlotCreateQueryFixtures';

export class GameInitialSnapshotCreateQueryFixtures {
  public static get any(): GameInitialSnapshotCreateQuery {
    return {
      currentCard: CardFixtures.any,
      currentColor: CardColor.blue,
      currentDirection: GameDirection.antiClockwise,
      currentPlayingSlotIndex: 0,
      deck: [GameCardSpecFixtures.any],
      drawCount: 0,
      gameId: '6fbcdb6c-b03c-4754-94c1-9f664f036cde',
      gameSlotCreateQueries: [GameInitialSnapshotSlotCreateQueryFixtures.any],
      id: 'c86b6e87-f33f-422f-9477-265400d87c0a',
    };
  }

  public static get withGameSlotCreateQueriesOne(): GameInitialSnapshotCreateQuery {
    return {
      ...GameInitialSnapshotCreateQueryFixtures.any,
      gameSlotCreateQueries: [GameInitialSnapshotSlotCreateQueryFixtures.any],
    };
  }
}
