import httpStatusCodes from 'http-status-codes';

import { Response } from '../models/Response';
import { ResponseWithBody } from '../models/ResponseWithBody';
import { JsonResponseBuilder } from './JsonResponseBuilder';

export class MultipleEntitiesGetResponseBuilder<
  TModel,
> extends JsonResponseBuilder<[TModel[]]> {
  public build(models: TModel[]): Response | ResponseWithBody<unknown> {
    return {
      body: models,
      headers: this._getHttpResponseHeaders(),
      statusCode: httpStatusCodes.OK,
    };
  }
}
