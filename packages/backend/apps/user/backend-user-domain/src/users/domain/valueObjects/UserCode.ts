import { UserCodeKind } from './UserCodeKind';

export interface UserCode {
  readonly code: string;
  readonly kind: UserCodeKind;
  readonly userId: string;
}
