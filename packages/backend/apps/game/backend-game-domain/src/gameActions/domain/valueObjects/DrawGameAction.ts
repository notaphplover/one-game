import { Card } from '../../../cards/domain/valueObjects/Card';
import { BaseGameAction } from './BaseGameAction';
import { GameActionKind } from './GameActionKind';

export interface DrawGameAction extends BaseGameAction<GameActionKind.draw> {
  readonly draw: Card[];
}
