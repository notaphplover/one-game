import { DrawGameActionCreateQuery } from './DrawGameActionCreateQuery';
import { PassTurnGameActionCreateQuery } from './PassTurnGameActionCreateQuery';
import { PlayCardsGameActionCreateQuery } from './PlayCardsGameActionCreateQuery';

export type GameActionCreateQuery =
  | DrawGameActionCreateQuery
  | PassTurnGameActionCreateQuery
  | PlayCardsGameActionCreateQuery;
