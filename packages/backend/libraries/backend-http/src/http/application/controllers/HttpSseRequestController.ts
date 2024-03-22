import { Builder, Either, Handler } from '@cornie-js/backend-common';

import { MessageEvent } from '../models/MessageEvent';
import { Request } from '../models/Request';
import { RequestWithBody } from '../models/RequestWithBody';
import { Response } from '../models/Response';
import { ResponseWithBody } from '../models/ResponseWithBody';
import { MiddlewarePipeline } from '../modules/MiddlewarePipeline';
import { SsePublisher } from '../modules/SsePublisher';
import { SseTeardownExecutor } from '../modules/SseTeardownExecutor';

export abstract class HttpSseRequestController<
  TRequest extends Request | RequestWithBody = Request | RequestWithBody,
  TUseCaseParams extends unknown[] = unknown[],
> implements
    Handler<
      [TRequest, SsePublisher],
      Either<Response, [Response, MessageEvent[], SseTeardownExecutor]>
    >
{
  readonly #requestParamHandler: Handler<[TRequest], TUseCaseParams>;
  readonly #responseFromErrorBuilder: Builder<
    Response | ResponseWithBody<unknown>,
    [unknown]
  >;
  readonly #middlewarePipeline: MiddlewarePipeline | undefined;

  constructor(
    requestParamHandler: Handler<[TRequest], TUseCaseParams>,
    responseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    middlewarePipeline?: MiddlewarePipeline,
  ) {
    this.#requestParamHandler = requestParamHandler;
    this.#responseFromErrorBuilder = responseFromErrorBuilder;
    this.#middlewarePipeline = middlewarePipeline;
  }

  public async handle(
    request: TRequest,
    publisher: SsePublisher,
  ): Promise<
    Either<
      Response | ResponseWithBody<unknown>,
      [Response, MessageEvent[], SseTeardownExecutor]
    >
  > {
    try {
      const response: Response | ResponseWithBody<unknown> | undefined =
        await this.#middlewarePipeline?.apply(request);

      if (response !== undefined) {
        return {
          isRight: false,
          value: response,
        };
      }

      return {
        isRight: true,
        value: await this.#handleUseCase(request, publisher),
      };
    } catch (error: unknown) {
      return {
        isRight: false,
        value: this.#responseFromErrorBuilder.build(error),
      };
    }
  }

  async #handleUseCase(
    request: TRequest,
    publisher: SsePublisher,
  ): Promise<[Response, MessageEvent[], SseTeardownExecutor]> {
    const useCaseParams: TUseCaseParams =
      await this.#requestParamHandler.handle(request);

    return this._handleUseCase(publisher, ...useCaseParams);
  }

  protected abstract _handleUseCase(
    publisher: SsePublisher,
    ...useCaseParams: TUseCaseParams
  ): Promise<[Response, MessageEvent[], SseTeardownExecutor]>;
}
