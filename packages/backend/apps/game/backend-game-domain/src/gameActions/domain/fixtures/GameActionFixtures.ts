import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { DrawGameAction } from '../valueObjects/DrawGameAction';
import { GameAction } from '../valueObjects/GameAction';
import { GameActionKind } from '../valueObjects/GameActionKind';
import { PassTurnGameAction } from '../valueObjects/PassTurnGameAction';
import { PlayCardsGameAction } from '../valueObjects/PlayCardsGameAction';

export class GameActionFixtures {
  public static get any(): GameAction {
    return {
      currentPlayingSlotIndex: 0,
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      kind: GameActionKind.passTurn,
      position: 1,
      turn: 1,
    };
  }

  public static get withKindCardsDrawnAndDrawOne(): DrawGameAction {
    return {
      currentPlayingSlotIndex: 0,
      draw: [CardFixtures.any],
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      kind: GameActionKind.draw,
      position: 1,
      turn: 1,
    };
  }

  public static get withKindPassTurn(): PassTurnGameAction {
    return {
      currentPlayingSlotIndex: 0,
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      kind: GameActionKind.passTurn,
      position: 1,
      turn: 1,
    };
  }

  public static get withKindPlayCardsAndCardsOne(): PlayCardsGameAction {
    return {
      cards: [CardFixtures.any],
      currentPlayingSlotIndex: 0,
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      kind: GameActionKind.playCards,
      position: 1,
      turn: 1,
    };
  }
}
