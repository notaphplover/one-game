import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { GameCardSpecFixtures } from '../../../games/domain/fixtures/GameCardSpecFixtures';
import { GameDirection } from '../../../games/domain/valueObjects/GameDirection';
import { GameInitialSnapshot } from '../entities/GameInitialSnapshot';

export class GameInitialSnapshotFixtures {
  public static get any(): GameInitialSnapshot {
    return {
      currentCard: CardFixtures.any,
      currentColor: CardColor.blue,
      currentDirection: GameDirection.antiClockwise,
      currentPlayingSlotIndex: 0,
      deck: [GameCardSpecFixtures.any],
      drawCount: 0,
      id: 'c86b6e87-f33f-422f-9477-265400d87c0a',
      slots: [],
    };
  }
}
