import { Builder, Handler } from '@one-game-js/backend-common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { Request } from '../../../application/models/Request';
import { RequestWithBody } from '../../../application/models/RequestWithBody';
import { Response } from '../../../application/models/Response';
import { ResponseWithBody } from '../../../application/models/ResponseWithBody';
import { MiddlewarePipeline } from '../../../application/modules/MiddlewarePipeline';

export class HttpNestFastifyController<
  TRequest extends Request | RequestWithBody = Request | RequestWithBody,
> implements Handler<[FastifyRequest, FastifyReply], void>
{
  readonly #requestBuilder: Builder<TRequest, [FastifyRequest]>;
  readonly #requestController: Handler<
    [TRequest],
    Response | ResponseWithBody<unknown>
  >;
  readonly #resultBuilder: Builder<
    FastifyReply,
    [Response | ResponseWithBody<unknown>, FastifyReply]
  >;
  readonly #middlewarePipeline: MiddlewarePipeline | undefined;

  constructor(
    requestBuilder: Builder<TRequest, [FastifyRequest]>,
    requestController: Handler<
      [TRequest],
      Response | ResponseWithBody<unknown>
    >,
    resultBuilder: Builder<
      FastifyReply,
      [Response | ResponseWithBody<unknown>, FastifyReply]
    >,
    middlewarePipeline?: MiddlewarePipeline,
  ) {
    this.#requestBuilder = requestBuilder;
    this.#requestController = requestController;
    this.#resultBuilder = resultBuilder;
    this.#middlewarePipeline = middlewarePipeline;
  }

  public async handle(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const appRequest: TRequest = this.#requestBuilder.build(request);

    const appResponse: Response | ResponseWithBody<unknown> =
      (await this.#middlewarePipeline?.apply(appRequest)) ??
      (await this.#requestController.handle(appRequest));

    await this.#resultBuilder.build(appResponse, reply);
  }
}
