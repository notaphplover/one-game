import { JoinGameResponse } from './JoinGame';
import { SerializableResponseUnion } from './SerializableResponseUnion';

export type JoinGameSerializedResponse =
  SerializableResponseUnion<JoinGameResponse>;
