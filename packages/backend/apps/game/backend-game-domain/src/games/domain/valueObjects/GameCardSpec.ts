import { Card } from '../../../cards/domain/valueObjects/Card';

export interface GameCardSpec {
  readonly amount: number;
  readonly card: Card;
}
