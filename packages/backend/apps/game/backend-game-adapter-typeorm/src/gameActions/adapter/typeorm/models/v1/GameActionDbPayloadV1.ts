import { DrawCardsGameActionDbPayloadV1 } from './DrawCardsGameActionDbPayloadV1';
import { PassTurnGameActionDbPayloadV1 } from './PassTurnGameActionDbPayloadV1';
import { PlayCardsGameActionDbPayloadV1 } from './PlayCardsGameActionDbPayloadV1';

export type GameActionDbPayloadV1 =
  | DrawCardsGameActionDbPayloadV1
  | PassTurnGameActionDbPayloadV1
  | PlayCardsGameActionDbPayloadV1;
