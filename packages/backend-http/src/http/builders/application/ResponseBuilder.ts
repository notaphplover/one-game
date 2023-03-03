import { Builder } from '@one-game-js/backend-common';

import { Response } from '../../models/application/Response';
import { ResponseWithBody } from '../../models/application/ResponseWithBody';

export abstract class ResponseBuilder<TParams extends unknown[]>
  implements Builder<Response | ResponseWithBody<unknown>, TParams>
{
  protected _getHttpResponseHeaders(): Record<string, string> {
    return { 'Content-Type': 'application/json' };
  }

  public abstract build(
    ...params: TParams
  ): Response | ResponseWithBody<unknown>;
}
