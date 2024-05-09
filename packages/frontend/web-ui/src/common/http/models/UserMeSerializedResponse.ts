import { SerializableResponseUnion } from './SerializableResponseUnion';
import { UserMeResponse } from './UserMeResponse';

export type UserMeSerializedResponse =
  SerializableResponseUnion<UserMeResponse>;
