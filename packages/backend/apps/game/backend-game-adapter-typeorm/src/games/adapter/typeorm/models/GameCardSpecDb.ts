import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';

export interface GameCardSpecDb {
  readonly amount: number;
  readonly card: CardDb;
}
