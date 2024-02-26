import { Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { Request } from '../../../application/models/Request';
import { RequestWithBody } from '../../../application/models/RequestWithBody';
import { RequestFromFastifyRequestBuilder } from './RequestFromFastifyRequestBuilder';

@Injectable()
export class RequestWithOptionalBodyFromFastifyRequestBuilder
  extends RequestFromFastifyRequestBuilder
  implements Builder<Request | RequestWithBody, [FastifyRequest]>
{
  public override build(
    fastifyRequest: FastifyRequest,
  ): Request | RequestWithBody {
    const request: Request | RequestWithBody = super.build(fastifyRequest);

    if (this.#isBody(fastifyRequest.body)) {
      (request as RequestWithBody).body = fastifyRequest.body;
    }

    return request;
  }

  #isBody(body: unknown): body is Record<string, unknown> {
    return typeof body === 'object';
  }
}
