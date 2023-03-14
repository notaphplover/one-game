import { Builder, Handler } from '@one-game-js/backend-common';

import { Request } from '../models/Request';
import { RequestWithBody } from '../models/RequestWithBody';
import { Response } from '../models/Response';
import { ResponseWithBody } from '../models/ResponseWithBody';
import { MiddlewarePipeline } from '../modules/MiddlewarePipeline';

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
  readonly #middlewarePipeline: MiddlewarePipeline | undefined;

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
    middlewarePipeline?: MiddlewarePipeline,
  ) {
    this.#requestParamHandler = requestParamHandler;
    this.#responseBuilder = responseBuilder;
    this.#responseFromErrorBuilder = responseFromErrorBuilder;
    this.#middlewarePipeline = middlewarePipeline;
  }

  public async handle(
    request: TRequest,
  ): Promise<Response | ResponseWithBody<unknown>> {
    try {
      const response: Response | ResponseWithBody<unknown> =
        (await this.#middlewarePipeline?.apply(request)) ??
        (await this.#handleUseCase(request));

      return response;
    } catch (error) {
      return this.#responseFromErrorBuilder.build(error);
    }
  }

  async #handleUseCase(
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
