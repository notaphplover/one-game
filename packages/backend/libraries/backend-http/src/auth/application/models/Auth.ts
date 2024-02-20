import { BackendServiceAuth } from './BackendServiceAuth';
import { UserAuth } from './UserAuth';

export type Auth<
  TPayload extends Record<string | symbol, unknown> = Record<
    string | symbol,
    unknown
  >,
> = BackendServiceAuth | UserAuth<TPayload>;
