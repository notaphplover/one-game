import { Builder, Handler } from '@cornie-js/backend-common';
import { MessageEvent } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable, Subscriber, TeardownLogic } from 'rxjs';

import { Request } from '../../../application/models/Request';
import { RequestWithBody } from '../../../application/models/RequestWithBody';
import { SseConsumer } from '../../../application/modules/SseConsumer';
import { SsePublisher } from '../../../application/modules/SsePublisher';
import { SseTeardownExecutor } from '../../../application/modules/SseTeardownExecutor';

export class HttpNestFastifySseController<
  TRequest extends Request | RequestWithBody = Request | RequestWithBody,
> {
  readonly #requestBuilder: Builder<TRequest, [FastifyRequest]>;
  readonly #requestController: Handler<
    [TRequest, SsePublisher],
    SseTeardownExecutor
  >;

  constructor(
    requestBuilder: Builder<TRequest, [FastifyRequest]>,
    requestController: Handler<[TRequest, SsePublisher], SseTeardownExecutor>,
  ) {
    this.#requestBuilder = requestBuilder;
    this.#requestController = requestController;
  }

  public handle(fastifyRequest: FastifyRequest): Observable<MessageEvent> {
    const request: TRequest = this.#requestBuilder.build(fastifyRequest);

    return new Observable(
      (subscriber: Subscriber<MessageEvent>): TeardownLogic => {
        const sseConsumer: SseConsumer = {
          consume: (event: string): void => {
            subscriber.next({
              data: event,
            });
          },
          onComplete: () => {
            subscriber.complete();
          },
        };

        const controllerResultPromise: Promise<SseTeardownExecutor> =
          this.#requestController.handle(
            request,
            new SsePublisher(sseConsumer),
          );

        void controllerResultPromise.catch((reason: unknown): void => {
          subscriber.error(reason);
        });

        return () =>
          void controllerResultPromise
            .then((sseTeardownExecutor: SseTeardownExecutor) =>
              sseTeardownExecutor.teardown(),
            )
            .catch();
      },
    );
  }
}
