import { Builder, Handler } from '@cornie-js/backend-common';
import { Logger, LoggerService } from '@nestjs/common';

import { Request } from '../models/Request';
import { RequestWithBody } from '../models/RequestWithBody';
import { Response } from '../models/Response';
import { ResponseWithBody } from '../models/ResponseWithBody';
import { MiddlewarePipeline } from '../modules/MiddlewarePipeline';

export abstract class HttpRequestController<
  TRequest extends Request | RequestWithBody = Request | RequestWithBody,
  TUseCaseParams extends unknown[] = unknown[],
  TUseCaseResult = unknown,
> implements Handler<[TRequest], Response | ResponseWithBody<unknown>>
{
  readonly #logger: LoggerService;
  readonly #requestParamHandler: Handler<[TRequest], TUseCaseParams>;
  readonly #responseBuilder: Builder<
    Response | ResponseWithBody<TUseCaseResult>,
    [TUseCaseResult]
  >;
  readonly #responseFromErrorBuilder: Builder<
    Response | ResponseWithBody<TUseCaseResult>,
    [unknown]
  >;
  readonly #middlewarePipeline: MiddlewarePipeline | undefined;

  constructor(
    requestParamHandler: Handler<[TRequest], TUseCaseParams>,
    responseBuilder: Builder<
      Response | ResponseWithBody<TUseCaseResult>,
      [TUseCaseResult]
    >,
    responseFromErrorBuilder: Builder<
      Response | ResponseWithBody<TUseCaseResult>,
      [unknown]
    >,
    middlewarePipeline?: MiddlewarePipeline,
  ) {
    this.#logger = new Logger(HttpRequestController.name);
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
    } catch (error: unknown) {
      this.#logger.error(`Unexpected error while processing request: 
        ${this.#stringifyError(error)}`);
      return this.#responseFromErrorBuilder.build(error);
    }
  }

  async #handleUseCase(
    request: TRequest,
  ): Promise<Response | ResponseWithBody<unknown>> {
    const useCaseParams: TUseCaseParams =
      await this.#requestParamHandler.handle(request);
    const useCaseResult: TUseCaseResult | undefined = await this._handleUseCase(
      ...useCaseParams,
    );

    const response: Response | ResponseWithBody<unknown> =
      this.#responseBuilder.build(useCaseResult);

    return response;
  }

  #stringifyError(error: unknown): string {
    return JSON.stringify(error, Object.getOwnPropertyNames(error));
  }

  protected abstract _handleUseCase(
    ...useCaseParams: TUseCaseParams
  ): Promise<TUseCaseResult>;
}
