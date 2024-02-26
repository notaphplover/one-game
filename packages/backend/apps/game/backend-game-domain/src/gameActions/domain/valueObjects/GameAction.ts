import { DrawGameAction } from './DrawGameAction';
import { PassTurnGameAction } from './PassTurnGameAction';
import { PlayCardsGameAction } from './PlayCardsGameAction';

export type GameAction =
  | DrawGameAction
  | PassTurnGameAction
  | PlayCardsGameAction;
