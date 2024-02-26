import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { RequestWithBody } from '../../../application/models/RequestWithBody';
import { RequestFromFastifyRequestBuilder } from './RequestFromFastifyRequestBuilder';

@Injectable()
export class RequestWithBodyFromFastifyRequestBuilder
  extends RequestFromFastifyRequestBuilder
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
      throw new AppError(
        AppErrorKind.contractViolation,
        'Invalid body. Expecting a body, but none was found',
      );
    }

    return body;
  }
}
