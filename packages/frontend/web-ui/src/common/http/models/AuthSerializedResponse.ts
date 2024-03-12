import { AuthResponse } from './AuthResponse';
import { SerializableResponseUnion } from './SerializableResponseUnion';

export type AuthSerializedResponse = SerializableResponseUnion<AuthResponse>;
