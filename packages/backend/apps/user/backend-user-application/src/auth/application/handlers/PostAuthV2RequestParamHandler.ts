import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import {
  Auth,
  AuthKind,
  AuthRequestContext,
  AuthRequestContextHolder,
  Request,
  RequestWithBody,
  requestContextProperty,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { RefreshTokenJwtPayload } from '../../../tokens/application/models/RefreshTokenJwtPayload';
import { PostAuthV2RequestBodyParamHandler } from './PostAuthV2RequestBodyParamHandler';

@Injectable()
export class PostAuthV2RequestParamHandler
  implements
    Handler<
      [Request | RequestWithBody],
      [
        apiModels.AuthCreateQueryV2 | undefined,
        RefreshTokenJwtPayload | undefined,
      ]
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
    [
      apiModels.AuthCreateQueryV2 | undefined,
      RefreshTokenJwtPayload | undefined,
    ]
  > {
    const refreshTokenJwtPayload: RefreshTokenJwtPayload | undefined =
      this.#tryGetRefreshTokenPayload(request);

    if (this.#isRequestWithBody(request)) {
      const [authCreateQueryV2]: [apiModels.AuthCreateQueryV2] =
        await this.#postAuthV2RequestBodyParamHandler.handle(request);

      return [authCreateQueryV2, refreshTokenJwtPayload];
    }

    return [undefined, refreshTokenJwtPayload];
  }

  #tryGetRefreshTokenPayload(
    request: Request &
      Partial<AuthRequestContextHolder<Auth<RefreshTokenJwtPayload>>>,
  ): RefreshTokenJwtPayload | undefined {
    const context:
      | AuthRequestContext<Auth<RefreshTokenJwtPayload>>
      | undefined = request[requestContextProperty];

    if (context === undefined) {
      return undefined;
    }

    if (context.auth.kind !== AuthKind.user) {
      throw new AppError(
        AppErrorKind.invalidCredentials,
        'Expecting user based credentials',
      );
    }

    return context.auth.jwtPayload;
  }

  #isRequestWithBody(
    request: Request | RequestWithBody,
  ): request is RequestWithBody {
    return (request as Partial<RequestWithBody>).body !== undefined;
  }
}
