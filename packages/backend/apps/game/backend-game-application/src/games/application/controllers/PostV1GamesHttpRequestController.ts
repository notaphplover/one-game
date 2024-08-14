import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  HttpRequestController,
  MiddlewarePipeline,
  RequestWithBody,
  Response,
  ResponseWithBody,
  SingleEntityPostResponseBuilder,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { AuthMiddleware } from '../../../auth/application/middlewares/AuthMiddleware';
import { PostV1GamesRequestParamHandler } from '../handlers/PostV1GamesRequestParamHandler';
import { GameManagementInputPort } from '../ports/input/GameManagementInputPort';

@Injectable()
export class PostV1GamesHttpRequestController extends HttpRequestController<
  RequestWithBody,
  [apiModels.GameCreateQueryV1],
  apiModels.GameV1
> {
  readonly #gameManagementInputPort: GameManagementInputPort;

  constructor(
    @Inject(PostV1GamesRequestParamHandler)
    requestParamHandler: Handler<
      [RequestWithBody],
      [apiModels.GameCreateQueryV1]
    >,
    @Inject(SingleEntityPostResponseBuilder)
    responseBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [apiModels.GameV1]
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
