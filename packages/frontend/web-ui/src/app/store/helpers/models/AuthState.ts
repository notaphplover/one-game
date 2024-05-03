import { AuthStateStatus } from './AuthStateStatus';

export interface BaseAuthState<
  TStatus extends AuthStateStatus = AuthStateStatus,
> {
  status: TStatus;
}

export type NonAuthenticatedAuthState =
  BaseAuthState<AuthStateStatus.nonAuthenticated>;

export type PendingAuthState = BaseAuthState<AuthStateStatus.pending>;

export interface AuthenticatedAuthState
  extends BaseAuthState<AuthStateStatus.authenticated> {
  accessToken: string;
  refreshToken: string;
}

export type AuthState =
  | AuthenticatedAuthState
  | NonAuthenticatedAuthState
  | PendingAuthState;
