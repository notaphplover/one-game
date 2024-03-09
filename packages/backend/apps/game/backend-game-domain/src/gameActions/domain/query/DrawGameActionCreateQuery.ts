import { Card } from '../../../cards/domain/valueObjects/Card';
import { GameActionKind } from '../valueObjects/GameActionKind';
import { BaseGameActionCreateQuery } from './BaseGameActionCreateQuery';

export interface DrawGameActionCreateQuery
  extends BaseGameActionCreateQuery<GameActionKind.draw> {
  draw: Card[];
}
