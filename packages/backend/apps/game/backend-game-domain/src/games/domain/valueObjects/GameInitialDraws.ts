import { Card } from '../../../cards/domain/valueObjects/Card';
import { GameCardSpec } from './GameCardSpec';

export interface GameInitialDraws {
  currentCard: Card;
  playersCards: Card[][];
  remainingDeck: GameCardSpec[];
}
