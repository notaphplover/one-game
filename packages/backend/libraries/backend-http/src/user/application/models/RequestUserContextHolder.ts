import { RequestContextHolder } from '../../../http/application/models/RequestContextHolder';
import { UserV1RequestContext } from './UserV1RequestContext';

export type RequestUserContextHolder =
  RequestContextHolder<UserV1RequestContext>;
