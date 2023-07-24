import { User, UserUpdateQuery } from '@cornie-js/backend-user-domain/users';

export interface UserUpdatedEvent {
  userBeforeUpdate: User;
  userUpdateQuery: UserUpdateQuery;
}
