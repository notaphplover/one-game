import { Builder, Handler } from '@one-game-js/backend-common';

import { Request } from '../../models/application/Request';
import { RequestWithBody } from '../../models/application/RequestWithBody';
import { Response } from '../../models/application/Response';
import { ResponseWithBody } from '../../models/application/ResponseWithBody';

export class SingleEntityHttpRequestController<
  TRequest extends Request | RequestWithBody = Request | RequestWithBody,
  TUseCaseParams extends unknown[] = unknown[],
  TModel = unknown,
  TModelApi = unknown,
> implements Handler<[TRequest], Response | ResponseWithBody<unknown>>
{
  readonly #requestParamHandler: Handler<[TRequest], TUseCaseParams>;
  readonly #useCaseHandler: Handler<TUseCaseParams, TModel | undefined>;
  readonly #apiModelBuilder: Builder<TModelApi, [TModel]>;
  readonly #responseBuilder: Builder<
    Response | ResponseWithBody<TModelApi>,
    [TModelApi | undefined]
  >;

  constructor(
    requestParamHandler: Handler<[TRequest], TUseCaseParams>,
    useCaseHandler: Handler<TUseCaseParams, TModel | undefined>,
    apiModelBuilder: Builder<TModelApi, [TModel]>,
    responseBuilder: Builder<
      Response | ResponseWithBody<TModelApi>,
      [TModelApi | undefined]
    >,
  ) {
    this.#requestParamHandler = requestParamHandler;
    this.#useCaseHandler = useCaseHandler;
    this.#apiModelBuilder = apiModelBuilder;
    this.#responseBuilder = responseBuilder;
  }

  public async handle(
    request: TRequest,
  ): Promise<Response | ResponseWithBody<unknown>> {
    const useCaseParams: TUseCaseParams =
      await this.#requestParamHandler.handle(request);
    const model: TModel | undefined = await this.#useCaseHandler.handle(
      ...useCaseParams,
    );

    let modelApi: TModelApi | undefined;

    if (model === undefined) {
      modelApi = undefined;
    } else {
      modelApi = this.#apiModelBuilder.build(model);
    }

    const response: Response | ResponseWithBody<unknown> =
      this.#responseBuilder.build(modelApi);

    return response;
  }
}
