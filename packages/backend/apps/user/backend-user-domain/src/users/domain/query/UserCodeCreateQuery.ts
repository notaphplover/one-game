import { UserCodeKind } from '../valueObjects/UserCodeKind';

export interface UserCodeCreateQuery {
  readonly code: string;
  readonly kind: UserCodeKind;
  readonly id: string;
  readonly userId: string;
}
