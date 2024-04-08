import { UserMeResponse } from './UserMeResponse';
import { SerializableResponseUnion } from './SerializableResponseUnion';

export type UserMeSerializedResponse =
  SerializableResponseUnion<UserMeResponse>;
