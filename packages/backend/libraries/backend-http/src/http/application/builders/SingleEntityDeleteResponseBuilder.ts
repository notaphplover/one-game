import httpStatusCodes from 'http-status-codes';

import { Response } from '../models/Response';
import { ResponseWithBody } from '../models/ResponseWithBody';
import { JsonResponseBuilder } from './JsonResponseBuilder';

export class SingleEntityDeleteResponseBuilder<
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  TModel,
> extends JsonResponseBuilder<[TModel | undefined]> {
  public build(
    model: TModel | undefined,
  ): Response | ResponseWithBody<unknown> {
    let httpResponse: Response | ResponseWithBody<unknown>;

    if (model === undefined) {
      httpResponse = {
        headers: this._getHttpResponseHeaders(),
        statusCode: httpStatusCodes.OK,
      };
    } else {
      httpResponse = {
        body: model,
        headers: this._getHttpResponseHeaders(),
        statusCode: httpStatusCodes.OK,
      };
    }

    return httpResponse;
  }
}
