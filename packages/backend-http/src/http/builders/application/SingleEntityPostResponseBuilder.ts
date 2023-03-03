import httpStatusCodes from 'http-status-codes';

import { Response } from '../../models/application/Response';
import { ResponseWithBody } from '../../models/application/ResponseWithBody';
import { ResponseBuilder } from './ResponseBuilder';

export class SingleEntityPostResponseBuilder<TModel> extends ResponseBuilder<
  [TModel | undefined]
> {
  public build(
    model: TModel | undefined,
  ): Response | ResponseWithBody<unknown> {
    let httpResponse: Response | ResponseWithBody<unknown>;

    if (model === undefined) {
      httpResponse = {
        headers: this._getHttpResponseHeaders(),
        statusCode: httpStatusCodes.CREATED,
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
