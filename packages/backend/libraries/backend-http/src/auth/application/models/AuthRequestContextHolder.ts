import { RequestContextHolder } from '../../../http/application/models/RequestContextHolder';
import { Auth } from './Auth';
import { AuthRequestContext } from './AuthRequestContext';

export type AuthRequestContextHolder<TAuth extends Auth = Auth> =
  RequestContextHolder<AuthRequestContext<TAuth>>;
