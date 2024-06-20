import { models as apiModels } from '@cornie-js/api-models';

import { UserInfoStatus } from './UserInfoStatus';

export interface BaseUseUserInfoResult<TStatus extends UserInfoStatus> {
  status: TStatus;
  updateUser: (userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1) => void;
}

export interface FetchingUserUseUserInfoResult
  extends BaseUseUserInfoResult<UserInfoStatus.fetchingUser> {
  userDetailV1: null;
  userV1: null;
}

export interface IdleUseUserInfoResult
  extends BaseUseUserInfoResult<UserInfoStatus.idle> {
  userDetailV1: apiModels.UserDetailV1;
  userV1: apiModels.UserV1;
}

export interface UpdatingUserUseUserInfoResult
  extends BaseUseUserInfoResult<UserInfoStatus.updatingUser> {
  userDetailV1: apiModels.UserDetailV1 | null;
  userV1: apiModels.UserV1 | null;
}

export interface UserFetchErrorUseUserInfoResult
  extends BaseUseUserInfoResult<UserInfoStatus.userFetchError> {
  userDetailV1: null;
  userV1: null;
}

export type UseUserInfoResult =
  | FetchingUserUseUserInfoResult
  | IdleUseUserInfoResult
  | UpdatingUserUseUserInfoResult
  | UserFetchErrorUseUserInfoResult;
