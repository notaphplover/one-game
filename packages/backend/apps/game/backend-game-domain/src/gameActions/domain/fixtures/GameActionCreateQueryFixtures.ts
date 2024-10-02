import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { GameDirection } from '../../../games/domain/valueObjects/GameDirection';
import { DrawGameActionCreateQuery } from '../query/DrawGameActionCreateQuery';
import { PassTurnGameActionCreateQuery } from '../query/PassTurnGameActionCreateQuery';
import { PlayCardsGameActionCreateQuery } from '../query/PlayCardsGameActionCreateQuery';
import { GameActionKind } from '../valueObjects/GameActionKind';

export class GameActionCreateQueryFixtures {
  public static get withKindDrawAndDrawOne(): DrawGameActionCreateQuery {
    return {
      currentPlayingSlotIndex: 0,
      draw: [CardFixtures.any],
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      id: '20f00a2b-bc9f-47fd-afb2-c2ed1b60e1b3',
      kind: GameActionKind.draw,
      turn: 1,
    };
  }

  public static get withKindPassTurn(): PassTurnGameActionCreateQuery {
    return {
      currentPlayingSlotIndex: 0,
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      id: '20f00a2b-bc9f-47fd-afb2-c2ed1b60e1b3',
      kind: GameActionKind.passTurn,
      nextPlayingSlotIndex: 1,
      turn: 1,
    };
  }

  public static get withKindPlayCardsAndCardsOne(): PlayCardsGameActionCreateQuery {
    return {
      cards: [CardFixtures.any],
      currentPlayingSlotIndex: 0,
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      id: '20f00a2b-bc9f-47fd-afb2-c2ed1b60e1b3',
      kind: GameActionKind.playCards,
      stateUpdate: {
        currentCard: CardFixtures.any,
        currentColor: CardColor.blue,
        currentDirection: GameDirection.antiClockwise,
        drawCount: 0,
      },
      turn: 1,
    };
  }
}
