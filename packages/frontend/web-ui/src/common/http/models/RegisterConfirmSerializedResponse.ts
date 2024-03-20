import { RegisterConfirmResponse } from './RegisterConfirmResponse';
import { SerializableResponseUnion } from './SerializableResponseUnion';

export type RegisterConfirmSerializedResponse =
  SerializableResponseUnion<RegisterConfirmResponse>;
