import { JoinGameResponse } from './JoinGameResponse';
import { SerializableResponseUnion } from './SerializableResponseUnion';

export type JoinGameSerializedResponse =
  SerializableResponseUnion<JoinGameResponse>;
