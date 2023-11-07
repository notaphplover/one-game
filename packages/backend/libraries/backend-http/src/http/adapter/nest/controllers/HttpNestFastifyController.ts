import { Builder, Handler } from '@cornie-js/backend-common';
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
  readonly #responseFromErrorBuilder: Builder<
    Response | ResponseWithBody<unknown>,
    [unknown]
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
    responseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    resultBuilder: Builder<
      FastifyReply,
      [Response | ResponseWithBody<unknown>, FastifyReply]
    >,
  ) {
    this.#requestBuilder = requestBuilder;
    this.#requestController = requestController;
    this.#responseFromErrorBuilder = responseFromErrorBuilder;
    this.#resultBuilder = resultBuilder;
  }

  public async handle(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    let appResponse: Response | ResponseWithBody<unknown>;

    try {
      const appRequest: TRequest = this.#requestBuilder.build(request);

      appResponse = await this.#requestController.handle(appRequest);
    } catch (error: unknown) {
      appResponse = this.#responseFromErrorBuilder.build(error);
    }

    await this.#resultBuilder.build(appResponse, reply);
  }
}
