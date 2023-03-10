import { Builder, Handler } from '@one-game-js/backend-common';
import {
  Request,
  RequestWithBody,
  Response,
  ResponseWithBody,
} from '@one-game-js/backend-http';
import { FastifyReply, FastifyRequest } from 'fastify';

export class HttpNestController<
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
