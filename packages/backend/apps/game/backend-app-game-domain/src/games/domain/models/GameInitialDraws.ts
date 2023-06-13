import { Card } from '../../../cards/domain/models/Card';
import { GameCardSpec } from './GameCardSpec';

export interface GameInitialDraws {
  currentCard: Card;
  playersCards: Card[][];
  remainingDeck: GameCardSpec[];
}
