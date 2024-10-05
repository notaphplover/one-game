import http from 'node:http';
import http2 from 'node:http2';

import { Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { Response } from '../../../application/models/Response';

const CORS_ORIGINS_SEPARATOR: string = ',';

@Injectable()
export class FastifySseReplyFromResponseBuilder
  implements Builder<FastifyReply, [Response, FastifyReply]>
{
  readonly #accessControlAllowOriginValue: string;

  constructor(corsOrigins: string[]) {
    this.#accessControlAllowOriginValue = corsOrigins.join(
      CORS_ORIGINS_SEPARATOR,
    );
  }

  public build(response: Response, fastifyReply: FastifyReply): FastifyReply {
    const sseHeaders: http.OutgoingHttpHeaders | http2.OutgoingHttpHeaders = {
      ...response.headers,
      'access-control-allow-origin': this.#accessControlAllowOriginValue,
      // Consider https://html.spec.whatwg.org/multipage/server-sent-events.html as reference
      // Disable cache, even for old browsers and proxies
      'cache-control':
        'private, no-cache, no-store, must-revalidate, max-age=0, no-transform',
      connection: 'keep-alive',
      'content-type': 'text/event-stream',
      expire: '0',
      pragma: 'no-cache',
      // NGINX support https://www.nginx.com/resources/wiki/start/topics/examples/x-accel/#x-accel-buffering
      'x-accel-buffering': 'no',
    };

    fastifyReply.raw.writeHead(response.statusCode, sseHeaders);

    fastifyReply.raw.flushHeaders();

    return fastifyReply;
  }
}
