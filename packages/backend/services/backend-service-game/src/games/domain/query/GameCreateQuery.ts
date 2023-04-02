import { GameCardSpec } from '../models/GameCardSpec';

export interface GameCreateQuery {
  readonly gameSlotIds: string[];
  readonly id: string;
  readonly spec: GameCardSpec[];
}
