import { Builder } from '@cornie-js/backend-common';

import { Response } from '../models/Response';
import { ResponseWithBody } from '../models/ResponseWithBody';

export abstract class ResponseBuilder<TParams extends unknown[]>
  implements Builder<Response | ResponseWithBody<unknown>, TParams>
{
  public abstract build(
    ...params: TParams
  ): Response | ResponseWithBody<unknown>;

  protected abstract _getHttpResponseHeaders(): Record<string, string>;
}
