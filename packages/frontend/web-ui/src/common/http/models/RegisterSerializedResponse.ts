import { RegisterResponse } from './RegisterResponse';
import { SerializableResponseUnion } from './SerializableResponseUnion';

export type RegisterSerializedResponse =
  SerializableResponseUnion<RegisterResponse>;
