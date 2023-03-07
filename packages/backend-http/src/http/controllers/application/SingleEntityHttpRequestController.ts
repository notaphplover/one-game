import { Builder, Handler } from '@one-game-js/backend-common';

import { Request } from '../../models/application/Request';
import { RequestWithBody } from '../../models/application/RequestWithBody';
import { Response } from '../../models/application/Response';
import { ResponseWithBody } from '../../models/application/ResponseWithBody';

export abstract class SingleEntityHttpRequestController<
  TRequest extends Request | RequestWithBody = Request | RequestWithBody,
  TUseCaseParams extends unknown[] = unknown[],
  TModel = unknown,
> implements Handler<[TRequest], Response | ResponseWithBody<unknown>>
{
  readonly #requestParamHandler: Handler<[TRequest], TUseCaseParams>;
  readonly #responseBuilder: Builder<
    Response | ResponseWithBody<TModel>,
    [TModel | undefined]
  >;

  constructor(
    requestParamHandler: Handler<[TRequest], TUseCaseParams>,
    responseBuilder: Builder<
      Response | ResponseWithBody<TModel>,
      [TModel | undefined]
    >,
  ) {
    this.#requestParamHandler = requestParamHandler;
    this.#responseBuilder = responseBuilder;
  }

  public async handle(
    request: TRequest,
  ): Promise<Response | ResponseWithBody<unknown>> {
    const useCaseParams: TUseCaseParams =
      await this.#requestParamHandler.handle(request);
    const model: TModel | undefined = await this._handleUseCase(
      ...useCaseParams,
    );

    const response: Response | ResponseWithBody<unknown> =
      this.#responseBuilder.build(model);

    return response;
  }

  protected abstract _handleUseCase(
    ...useCaseParams: TUseCaseParams
  ): Promise<TModel | undefined>;
}
