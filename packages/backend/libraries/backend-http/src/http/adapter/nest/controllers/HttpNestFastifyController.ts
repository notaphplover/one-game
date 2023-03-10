import { Builder, Handler } from '@one-game-js/backend-common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { Request } from '../../../application/models/Request';
import { RequestWithBody } from '../../../application/models/RequestWithBody';
import { Response } from '../../../application/models/Response';
import { ResponseWithBody } from '../../../application/models/ResponseWithBody';

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
  ) {
    this.#requestBuilder = requestBuilder;
    this.#requestController = requestController;
    this.#resultBuilder = resultBuilder;
  }

  public async handle(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const appRequest: TRequest = this.#requestBuilder.build(request);
    const appResponse: Response | ResponseWithBody<unknown> =
      await this.#requestController.handle(appRequest);

    await this.#resultBuilder.build(appResponse, reply);
  }
}
