import { Builder, Controller } from '@one-game-js/backend-common';

import { Request } from '../../models/application/Request';
import { RequestWithBody } from '../../models/application/RequestWithBody';
import { Response } from '../../models/application/Response';
import { ResponseWithBody } from '../../models/application/ResponseWithBody';

export class HttpController<
  TParams extends unknown[] = unknown[],
  TRequest extends Request | RequestWithBody = Request | RequestWithBody,
  TResult = unknown,
> implements Controller<TParams, TResult>
{
  #requestBuilder: Builder<TRequest, TParams>;
  #requestController: Controller<
    TRequest,
    Response | ResponseWithBody<unknown>
  >;
  #resultBuilder: Builder<TResult, [Response | ResponseWithBody<unknown>]>;

  constructor(
    requestBuilder: Builder<TRequest, TParams>,
    requestController: Controller<
      TRequest,
      Response | ResponseWithBody<unknown>
    >,
    resultBuilder: Builder<TResult, [Response | ResponseWithBody<unknown>]>,
  ) {
    this.#requestBuilder = requestBuilder;
    this.#requestController = requestController;
    this.#resultBuilder = resultBuilder;
  }

  public async handle(params: TParams): Promise<TResult> {
    const appRequest: TRequest = this.#requestBuilder.build(...params);
    const appResponse: Response | ResponseWithBody<unknown> =
      await this.#requestController.handle(appRequest);

    return this.#resultBuilder.build(appResponse);
  }
}
