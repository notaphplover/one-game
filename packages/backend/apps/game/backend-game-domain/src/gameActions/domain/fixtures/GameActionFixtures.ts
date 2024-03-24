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
      id: '16b54159-a4ef-41fc-994a-20709526bda0',
      kind: GameActionKind.passTurn,
      nextPlayingSlotIndex: 1,
      position: 1,
      turn: 1,
    };
  }

  public static get withKindCardsDrawnAndDrawOne(): DrawGameAction {
    return {
      currentPlayingSlotIndex: 0,
      draw: [CardFixtures.any],
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      id: '16b54159-a4ef-41fc-994a-20709526bda0',
      kind: GameActionKind.draw,
      position: 1,
      turn: 1,
    };
  }

  public static get withKindPassTurn(): PassTurnGameAction {
    return {
      currentPlayingSlotIndex: 0,
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      id: '16b54159-a4ef-41fc-994a-20709526bda0',
      kind: GameActionKind.passTurn,
      nextPlayingSlotIndex: 1,
      position: 1,
      turn: 1,
    };
  }

  public static get withKindPlayCards(): PlayCardsGameAction {
    return {
      cards: [],
      currentCard: null,
      currentPlayingSlotIndex: 0,
      gameId: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      id: '16b54159-a4ef-41fc-994a-20709526bda0',
      kind: GameActionKind.playCards,
      position: 1,
      turn: 1,
    };
  }

  public static get withKindPlayCardsAndCardsOneAndCurrentCard(): PlayCardsGameAction {
    return {
      ...GameActionFixtures.withKindPlayCards,
      cards: [CardFixtures.any],
      currentCard: CardFixtures.any,
    };
  }

  public static get withKindPlayCardsAndCardsOneAndCurrentCardNull(): PlayCardsGameAction {
    return {
      ...GameActionFixtures.withKindPlayCards,
      cards: [CardFixtures.any],
      currentCard: null,
    };
  }
}
