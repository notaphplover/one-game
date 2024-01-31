import { TransactionContext } from '@cornie-js/backend-db/application';
import { User, UserCreateQuery } from '@cornie-js/backend-user-domain/users';

export interface UserCreatedEvent {
  transactionContext?: TransactionContext;
  user: User;
  userCreateQuery: UserCreateQuery;
}
