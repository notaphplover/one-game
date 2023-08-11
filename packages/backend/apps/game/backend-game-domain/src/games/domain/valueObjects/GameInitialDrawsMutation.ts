import { Card } from '../../../cards/domain/valueObjects/Card';
import { GameCardSpec } from './GameCardSpec';

export interface GameInitialDrawsMutation {
  currentCard: Card;
  cards: Card[][];
  deck: GameCardSpec[];
}
