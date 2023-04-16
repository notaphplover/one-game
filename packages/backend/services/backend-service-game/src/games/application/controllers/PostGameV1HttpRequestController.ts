import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Builder, Handler } from '@one-game-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  MiddlewarePipeline,
  RequestWithBody,
  Response,
  ResponseWithBody,
  SingleEntityHttpRequestController,
  SingleEntityPostResponseBuilder,
} from '@one-game-js/backend-http';

import { AuthMiddleware } from '../../../auth/application/middlewares/AuthMiddleware';
import { PostGameV1RequestParamHandler } from '../handlers/PostGameV1RequestParamHandler';
import { GameManagementInputPort } from '../ports/input/GameManagementInputPort';

@Injectable()
export class PostGameV1HttpRequestController extends SingleEntityHttpRequestController<
  RequestWithBody,
  [apiModels.GameCreateQueryV1],
  apiModels.GameV1
> {
  readonly #gameManagementInputPort: GameManagementInputPort;

  constructor(
    @Inject(PostGameV1RequestParamHandler)
    requestParamHandler: Handler<
      [RequestWithBody],
      [apiModels.GameCreateQueryV1]
    >,
    @Inject(SingleEntityPostResponseBuilder)
    responseBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [apiModels.GameV1 | undefined]
    >,
    @Inject(ErrorV1ResponseFromErrorBuilder)
    errorV1ResponseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    @Inject(GameManagementInputPort)
    gameManagementInputPort: GameManagementInputPort,
    @Inject(AuthMiddleware)
    authMiddleware: AuthMiddleware,
  ) {
    super(
      requestParamHandler,
      responseBuilder,
      errorV1ResponseFromErrorBuilder,
      new MiddlewarePipeline([authMiddleware]),
    );

    this.#gameManagementInputPort = gameManagementInputPort;
  }

  protected async _handleUseCase(
    gameCreateQueryV1: apiModels.GameCreateQueryV1,
  ): Promise<apiModels.GameV1> {
    return this.#gameManagementInputPort.create(gameCreateQueryV1);
  }
}
