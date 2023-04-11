import { Auth } from './Auth';

export interface AuthRequestContext<TAuth extends Auth = Auth>
  extends Record<string | symbol, unknown> {
  auth: TAuth;
}
