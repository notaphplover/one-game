import { GameActionKind } from '../valueObjects/GameActionKind';
import { BaseGameActionCreateQuery } from './BaseGameActionCreateQuery';

export type PassTurnGameActionCreateQuery =
  BaseGameActionCreateQuery<GameActionKind.passTurn>;
