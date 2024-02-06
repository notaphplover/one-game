import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { User, UserCreateQuery } from '@cornie-js/backend-user-domain/users';

export interface UserCreatedEvent {
  transactionWrapper?: TransactionWrapper;
  user: User;
  userCreateQuery: UserCreateQuery;
}
