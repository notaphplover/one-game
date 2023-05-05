import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  MiddlewarePipeline,
  RequestWithBody,
  Response,
  ResponseWithBody,
  SingleEntityHttpRequestController,
  SingleEntityPostResponseBuilder,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { AuthMiddleware } from '../../../auth/application/middlewares/AuthMiddleware';
import { Game } from '../../domain/models/Game';
import { PostGameIdSlotV1RequestParamHandler } from '../handlers/PostGameIdSlotV1RequestParamHandler';
import { GameMiddleware } from '../middlewares/GameMiddleware';
import { GameSlotManagementInputPort } from '../ports/input/GameSlotManagementInputPort';

@Injectable()
export class PostGameIdSlotV1HttpRequestController extends SingleEntityHttpRequestController<
  RequestWithBody,
  [apiModels.GameIdSlotCreateQueryV1, Game],
  apiModels.GameSlotV1
> {
  readonly #gameSlotManagementInputPort: GameSlotManagementInputPort;

  constructor(
    @Inject(PostGameIdSlotV1RequestParamHandler)
    requestParamHandler: Handler<
      [RequestWithBody],
      [apiModels.GameIdSlotCreateQueryV1, Game]
    >,
    @Inject(SingleEntityPostResponseBuilder)
    responseBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [apiModels.GameSlotV1 | undefined]
    >,
    @Inject(ErrorV1ResponseFromErrorBuilder)
    errorV1ResponseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    @Inject(GameSlotManagementInputPort)
    gameSlotManagementInputPort: GameSlotManagementInputPort,
    @Inject(AuthMiddleware)
    authMiddleware: AuthMiddleware,
    @Inject(GameMiddleware)
    gameMiddleware: GameMiddleware,
  ) {
    super(
      requestParamHandler,
      responseBuilder,
      errorV1ResponseFromErrorBuilder,
      new MiddlewarePipeline([authMiddleware, gameMiddleware]),
    );

    this.#gameSlotManagementInputPort = gameSlotManagementInputPort;
  }

  protected async _handleUseCase(
    gameIdSlotCreateQueryV1: apiModels.GameIdSlotCreateQueryV1,
    game: Game,
  ): Promise<apiModels.GameSlotV1> {
    return this.#gameSlotManagementInputPort.create(
      gameIdSlotCreateQueryV1,
      game,
    );
  }
}
