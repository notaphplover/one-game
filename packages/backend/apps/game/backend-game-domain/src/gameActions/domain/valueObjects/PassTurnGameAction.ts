import { BaseGameAction } from './BaseGameAction';
import { GameActionKind } from './GameActionKind';

export type PassTurnGameAction = BaseGameAction<GameActionKind.passTurn>;
