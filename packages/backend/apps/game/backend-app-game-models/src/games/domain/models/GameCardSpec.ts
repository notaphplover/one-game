import { Card } from '../../../cards/domain/models/Card';

export interface GameCardSpec {
  readonly amount: number;
  readonly card: Card;
}
