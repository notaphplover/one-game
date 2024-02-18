import { UserV1 } from '@cornie-js/api-models/lib/models/types';

import { AuthKind } from './AuthKind';
import { BaseAuth } from './BaseAuth';

export interface UserAuth<
  TPayload extends Record<string | symbol, unknown> = Record<
    string | symbol,
    unknown
  >,
> extends BaseAuth<AuthKind.user> {
  jwtPayload: TPayload;
  user: UserV1;
}
