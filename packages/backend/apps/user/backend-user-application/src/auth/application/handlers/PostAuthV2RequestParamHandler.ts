import { models as apiModels } from '@cornie-js/api-models';
import { Handler } from '@cornie-js/backend-common';
import { Request, RequestWithBody } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { PostAuthV2RequestBodyParamHandler } from './PostAuthV2RequestBodyParamHandler';

@Injectable()
export class PostAuthV2RequestParamHandler
  implements
    Handler<
      [Request | RequestWithBody],
      [apiModels.AuthCreateQueryV2 | undefined, Request | RequestWithBody]
    >
{
  readonly #postAuthV2RequestBodyParamHandler: Handler<
    [RequestWithBody],
    [apiModels.AuthCreateQueryV2]
  >;

  constructor(
    @Inject(PostAuthV2RequestBodyParamHandler)
    postAuthV2RequestBodyParamHandler: Handler<
      [RequestWithBody],
      [apiModels.AuthCreateQueryV2]
    >,
  ) {
    this.#postAuthV2RequestBodyParamHandler = postAuthV2RequestBodyParamHandler;
  }

  public async handle(
    request: Request | RequestWithBody,
  ): Promise<
    [apiModels.AuthCreateQueryV2 | undefined, Request | RequestWithBody]
  > {
    if (this.#isRequestWithBody(request)) {
      const [authCreateQueryV2]: [apiModels.AuthCreateQueryV2] =
        await this.#postAuthV2RequestBodyParamHandler.handle(request);

      return [authCreateQueryV2, request];
    }

    return [undefined, request];
  }

  #isRequestWithBody(
    request: Request | RequestWithBody,
  ): request is RequestWithBody {
    return (request as Partial<RequestWithBody>).body !== undefined;
  }
}
