import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  HttpRequestController,
  MiddlewarePipeline,
  Request,
  RequestWithBody,
  Response,
  ResponseWithBody,
  SingleEntityPostResponseBuilder,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { RefreshTokenJwtPayload } from '../../../tokens/application/models/RefreshTokenJwtPayload';
import { PostAuthV2RequestParamHandler } from '../handlers/PostAuthV2RequestParamHandler';
import { RefreshTokenAuthMiddleware } from '../middlewares/RefreshTokenAuthMiddleware';
import { AuthManagementInputPort } from '../ports/input/AuthManagementInputPort';

@Injectable()
export class PostAuthV2HttpRequestController extends HttpRequestController<
  Request | RequestWithBody,
  [apiModels.AuthCreateQueryV2 | undefined, RefreshTokenJwtPayload | undefined],
  apiModels.AuthV2
> {
  readonly #authManagementInputPort: AuthManagementInputPort;

  constructor(
    @Inject(PostAuthV2RequestParamHandler)
    requestParamHandler: Handler<
      [Request | RequestWithBody],
      [
        apiModels.AuthCreateQueryV2 | undefined,
        RefreshTokenJwtPayload | undefined,
      ]
    >,
    @Inject(SingleEntityPostResponseBuilder)
    responseBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [apiModels.AuthV2]
    >,
    @Inject(ErrorV1ResponseFromErrorBuilder)
    errorV1ResponseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    @Inject(AuthManagementInputPort)
    authManagementInputPort: AuthManagementInputPort,
    @Inject(RefreshTokenAuthMiddleware)
    refreshTokenAuthMiddleware: RefreshTokenAuthMiddleware,
  ) {
    super(
      requestParamHandler,
      responseBuilder,
      errorV1ResponseFromErrorBuilder,
      new MiddlewarePipeline([refreshTokenAuthMiddleware]),
    );

    this.#authManagementInputPort = authManagementInputPort;
  }

  protected async _handleUseCase(
    authCreateQueryV2: apiModels.AuthCreateQueryV2 | undefined,
    refreshTokenJwtPayload: RefreshTokenJwtPayload | undefined,
  ): Promise<apiModels.AuthV2> {
    if (authCreateQueryV2 === undefined) {
      if (refreshTokenJwtPayload === undefined) {
        throw new AppError(
          AppErrorKind.contractViolation,
          'Expecting a JSON body or refresh token jwt credentials',
        );
      } else {
        return this.#authManagementInputPort.createByRefreshTokenV2(
          refreshTokenJwtPayload,
        );
      }
    } else {
      return this.#authManagementInputPort.createByQueryV2(authCreateQueryV2);
    }
  }
}
