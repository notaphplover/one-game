import {
  User,
  UserCode,
  UserCreateQuery,
} from '@cornie-js/backend-user-domain/users';

export interface UserCreatedEvent {
  user: User;
  userCode: UserCode;
  userCreateQuery: UserCreateQuery;
}
