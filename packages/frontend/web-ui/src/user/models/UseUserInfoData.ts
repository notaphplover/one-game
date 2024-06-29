import { UserInfoStatus } from './UserInfoStatus';

export interface BaseUserInfoFormFields {
  confirmPassword: string | null;
  email: string | null;
  name: string | null;
  password: string | null;
}

export interface UserInfoFormFields extends BaseUserInfoFormFields {
  email: string;
  name: string;
}

export interface BaseUserInfoFormData {
  fields: BaseUserInfoFormFields;
  validation: UserInfoFormValidationResult;
}

export interface UserInfoFormData {
  fields: UserInfoFormFields;
  validation: UserInfoFormValidationResult;
}

export interface BaseUseUserInfoData<
  TForm extends BaseUserInfoFormData,
  TStatus extends UserInfoStatus,
> {
  form: TForm;
  status: TStatus;
}

export type FetchingUserUseUserInfoData = BaseUseUserInfoData<
  BaseUserInfoFormData,
  UserInfoStatus.fetchingUser
>;

export type IdleUseUserInfoData = BaseUseUserInfoData<
  UserInfoFormData,
  UserInfoStatus.idle
>;

export type UpdatingUserUseUserInfoData = BaseUseUserInfoData<
  BaseUserInfoFormData,
  UserInfoStatus.updatingUser
>;

export type UserFetchErrorUseUserInfoData = BaseUseUserInfoData<
  BaseUserInfoFormData,
  UserInfoStatus.userFetchError
>;

export interface UserInfoFormValidationResult {
  confirmPassword?: string;
  name?: string;
  password?: string;
}

export type UseUserInfoData =
  | FetchingUserUseUserInfoData
  | IdleUseUserInfoData
  | UpdatingUserUseUserInfoData
  | UserFetchErrorUseUserInfoData;
