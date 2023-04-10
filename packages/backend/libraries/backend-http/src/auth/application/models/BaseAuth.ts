import { AuthKind } from './AuthKind';

export interface BaseAuth<TKind extends AuthKind> {
  kind: TKind;
}
