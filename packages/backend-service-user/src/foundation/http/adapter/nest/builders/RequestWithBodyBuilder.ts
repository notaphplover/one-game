import { Injectable } from '@nestjs/common';
import { Builder } from '@one-game-js/backend-common';
import { RequestWithBody } from '@one-game-js/backend-http';
import { FastifyRequest } from 'fastify';

import { RequestBuilder } from './RequestBuilder';

@Injectable()
export class RequestWithBodyBuilder
  extends RequestBuilder
  implements Builder<RequestWithBody, [FastifyRequest]>
{
  public override build(fastifyRequest: FastifyRequest): RequestWithBody {
    return {
      ...super.build(fastifyRequest),
      body: this.#parseBody(fastifyRequest.body),
    };
  }

  #isBody(body: unknown): body is Record<string, unknown> {
    return typeof body === 'object';
  }

  #parseBody(body: unknown): Record<string, unknown> {
    if (!this.#isBody(body)) {
      throw new Error('Invalid body!');
    }

    return body;
  }
}
