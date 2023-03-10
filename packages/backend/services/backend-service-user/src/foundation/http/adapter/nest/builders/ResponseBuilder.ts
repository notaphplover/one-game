import { Injectable } from '@nestjs/common';
import { Builder } from '@one-game-js/backend-common';
import { Response, ResponseWithBody } from '@one-game-js/backend-http';
import { FastifyReply } from 'fastify';

@Injectable()
export class ResponseBuilder
  implements
    Builder<FastifyReply, [Response | ResponseWithBody<unknown>, FastifyReply]>
{
  public build(
    response: Response | ResponseWithBody<unknown>,
    reply: FastifyReply,
  ): FastifyReply {
    const bodyOrUndefined: unknown = (response as ResponseWithBody<unknown>)
      .body;

    let replyResult: FastifyReply = reply
      .headers(response.headers)
      .status(response.statusCode);

    if (bodyOrUndefined === undefined) {
      replyResult = replyResult.send();
    } else {
      replyResult = replyResult.send(bodyOrUndefined);
    }

    return replyResult;
  }
}
