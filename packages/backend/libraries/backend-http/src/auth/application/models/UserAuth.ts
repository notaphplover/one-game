import { UserV1 } from '@one-game-js/api-models/lib/models/types';

import { AuthKind } from './AuthKind';
import { BaseAuth } from './BaseAuth';

export interface UserAuth extends BaseAuth<AuthKind.user> {
  user: UserV1;
}
