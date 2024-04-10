import { NewGameResponse } from './NewGameResponse';
import { SerializableResponseUnion } from './SerializableResponseUnion';

export type NewGameSerializedResponse =
  SerializableResponseUnion<NewGameResponse>;
