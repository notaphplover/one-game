import { Card } from '../../../cards/domain/valueObjects/Card';
import { GameCardSpec } from '../valueObjects/GameCardSpec';

export interface GameDrawMutation {
  cards: Card[];
  deck: GameCardSpec[];
  isDiscardPileEmptied: boolean;
}
