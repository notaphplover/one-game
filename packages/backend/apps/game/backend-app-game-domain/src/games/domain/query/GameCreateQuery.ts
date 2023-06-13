import { GameSpec } from '../models/GameSpec';

export interface GameCreateQuery {
  readonly gameSlotsAmount: number;
  readonly id: string;
  readonly spec: GameSpec;
}
