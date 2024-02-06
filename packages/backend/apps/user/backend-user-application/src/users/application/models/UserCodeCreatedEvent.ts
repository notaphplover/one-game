import { User, UserCode } from '@cornie-js/backend-user-domain/users';

export interface UserCodeCreatedEvent {
  user: User;
  userCode: UserCode;
}
