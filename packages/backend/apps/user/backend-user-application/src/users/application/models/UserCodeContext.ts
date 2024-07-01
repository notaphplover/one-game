import { UserCodeKind } from '@cornie-js/backend-user-domain/users';

export interface UserCodeContext {
  kind: UserCodeKind;
  userCode: string;
}
