import { Builder } from '@one-game-js/backend-common';
import httpStatusCodes from 'http-status-codes';

import { Response } from '../../models/application/Response';
import { ResponseWithBody } from '../../models/application/ResponseWithBody';

export class SingleEntityGetResponseBuilder<TModel>
  implements
    Builder<Response | ResponseWithBody<unknown>, [TModel | undefined]>
{
  public build(
    model: TModel | undefined,
  ): Response | ResponseWithBody<unknown> {
    let httpResponse: Response | ResponseWithBody<unknown>;

    if (model === undefined) {
      httpResponse = {
        headers: this.#getHttpResponseHeaders(),
        statusCode: httpStatusCodes.NOT_FOUND,
      };
    } else {
      httpResponse = {
        body: model,
        headers: this.#getHttpResponseHeaders(),
        statusCode: httpStatusCodes.OK,
      };
    }

    return httpResponse;
  }

  #getHttpResponseHeaders(): Record<string, string> {
    return { 'Content-Type': 'application/json' };
  }
}
