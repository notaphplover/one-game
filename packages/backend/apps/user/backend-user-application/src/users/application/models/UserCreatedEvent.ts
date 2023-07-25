import { User, UserCreateQuery } from '@cornie-js/backend-user-domain/users';

export interface UserCreatedEvent {
  user: User;
  userCreateQuery: UserCreateQuery;
}
