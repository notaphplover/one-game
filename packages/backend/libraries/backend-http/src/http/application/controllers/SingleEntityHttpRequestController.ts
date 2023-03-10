import { Builder, Handler } from '@one-game-js/backend-common';

import { Request } from '../models/Request';
import { RequestWithBody } from '../models/RequestWithBody';
import { Response } from '../models/Response';
import { ResponseWithBody } from '../models/ResponseWithBody';

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
  readonly #responseFromErrorBuilder: Builder<
    Response | ResponseWithBody<TModel>,
    [unknown]
  >;

  constructor(
    requestParamHandler: Handler<[TRequest], TUseCaseParams>,
    responseBuilder: Builder<
      Response | ResponseWithBody<TModel>,
      [TModel | undefined]
    >,
    responseFromErrorBuilder: Builder<
      Response | ResponseWithBody<TModel>,
      [unknown]
    >,
  ) {
    this.#requestParamHandler = requestParamHandler;
    this.#responseBuilder = responseBuilder;
    this.#responseFromErrorBuilder = responseFromErrorBuilder;
  }

  public async handle(
    request: TRequest,
  ): Promise<Response | ResponseWithBody<unknown>> {
    try {
      const useCaseParams: TUseCaseParams =
        await this.#requestParamHandler.handle(request);
      const model: TModel | undefined = await this._handleUseCase(
        ...useCaseParams,
      );

      const response: Response | ResponseWithBody<unknown> =
        this.#responseBuilder.build(model);

      return response;
    } catch (error) {
      return this.#responseFromErrorBuilder.build(error);
    }
  }

  protected abstract _handleUseCase(
    ...useCaseParams: TUseCaseParams
  ): Promise<TModel | undefined>;
}
