import { UserStateStatus } from './UserStateStatus';

export interface BaseUserState<
  TStatus extends UserStateStatus = UserStateStatus,
> {
  status: TStatus;
}

export type IdleUserState = BaseUserState<UserStateStatus.idle>;

export type PendingUserState = BaseUserState<UserStateStatus.pending>;

export interface FulfilledUserState
  extends BaseUserState<UserStateStatus.fulfilled> {
  userId: string;
}

export type RejectedUserState = BaseUserState<UserStateStatus.rejected>;

export type UserState =
  | IdleUserState
  | PendingUserState
  | FulfilledUserState
  | RejectedUserState;
