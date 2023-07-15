import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import { Game } from '@cornie-js/backend-game-domain/games';
import {
  ErrorV1ResponseFromErrorBuilder,
  MiddlewarePipeline,
  RequestWithBody,
  Response,
  ResponseWithBody,
  HttpRequestController,
  SingleEntityPostResponseBuilder,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { AuthMiddleware } from '../../../auth/application/middlewares/AuthMiddleware';
import { PostGameIdSlotV1RequestParamHandler } from '../handlers/PostGameIdSlotV1RequestParamHandler';
import { GameMiddleware } from '../middlewares/GameMiddleware';
import { GameSlotManagementInputPort } from '../ports/input/GameSlotManagementInputPort';

@Injectable()
export class PostGameIdSlotV1HttpRequestController extends HttpRequestController<
  RequestWithBody,
  [apiModels.GameIdSlotCreateQueryV1, Game, apiModels.UserV1],
  apiModels.GameSlotV1
> {
  readonly #gameSlotManagementInputPort: GameSlotManagementInputPort;

  constructor(
    @Inject(PostGameIdSlotV1RequestParamHandler)
    requestParamHandler: Handler<
      [RequestWithBody],
      [apiModels.GameIdSlotCreateQueryV1, Game, apiModels.UserV1]
    >,
    @Inject(SingleEntityPostResponseBuilder)
    responseBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [apiModels.GameSlotV1]
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
    user: apiModels.UserV1,
  ): Promise<apiModels.GameSlotV1> {
    if (gameIdSlotCreateQueryV1.userId !== user.id) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Unable to create a game slot impersonating another user.',
      );
    }

    return this.#gameSlotManagementInputPort.create(
      gameIdSlotCreateQueryV1,
      game,
    );
  }
}
