import httpStatusCodes from 'http-status-codes';

import { Response } from '../models/Response';
import { ResponseWithBody } from '../models/ResponseWithBody';
import { ResponseBuilder } from './ResponseBuilder';

export class SingleEntityGetResponseBuilder<TModel> extends ResponseBuilder<
  [TModel | undefined]
> {
  public build(
    model: TModel | undefined,
  ): Response | ResponseWithBody<unknown> {
    let httpResponse: Response | ResponseWithBody<unknown>;

    if (model === undefined) {
      httpResponse = {
        headers: this._getHttpResponseHeaders(),
        statusCode: httpStatusCodes.NOT_FOUND,
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
