import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import { BaseGameSlot, Game } from '@cornie-js/backend-game-domain/games';
import {
  AuthRequestContextHolder,
  ErrorV1ResponseFromErrorBuilder,
  HttpSseRequestController,
  MessageEvent,
  MiddlewarePipeline,
  Request,
  Response,
  ResponseWithBody,
  SsePublisher,
  SseTeardownExecutor,
} from '@cornie-js/backend-http';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { AuthMiddleware } from '../../../auth/application/middlewares/AuthMiddleware';
import { GetGameGameIdEventsV1RequestParamHandler } from '../handlers/GetGameGameIdEventsV1RequestParamHandler';
import { GameMiddleware } from '../middlewares/GameMiddleware';
import { GameRequestContextHolder } from '../models/GameRequestContextHolder';
import { GameEventsManagementInputPort } from '../ports/input/GameEventsManagementInputPort';

@Injectable()
export class GetGameGameIdEventsV1SseController extends HttpSseRequestController<
  Request & AuthRequestContextHolder & GameRequestContextHolder,
  [Game, apiModels.UserV1]
> {
  readonly #gameEventsManagementInputPort: GameEventsManagementInputPort;

  constructor(
    @Inject(GetGameGameIdEventsV1RequestParamHandler)
    getGameGameIdEventsV1RequestParamHandler: Handler<
      [Request & AuthRequestContextHolder & GameRequestContextHolder],
      [Game, apiModels.UserV1]
    >,
    @Inject(ErrorV1ResponseFromErrorBuilder)
    responseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    @Inject(AuthMiddleware)
    authMiddleware: AuthMiddleware,
    @Inject(GameMiddleware)
    gameMiddleware: GameMiddleware,
    @Inject(GameEventsManagementInputPort)
    gameEventsManagementInputPort: GameEventsManagementInputPort,
  ) {
    super(
      getGameGameIdEventsV1RequestParamHandler,
      responseFromErrorBuilder,
      new MiddlewarePipeline([authMiddleware, gameMiddleware]),
    );

    this.#gameEventsManagementInputPort = gameEventsManagementInputPort;
  }

  protected override async _handleUseCase(
    publisher: SsePublisher,
    game: Game,
    userV1: apiModels.UserV1,
  ): Promise<[Response, MessageEvent[], SseTeardownExecutor]> {
    if (!this.#isUserPlayingGame(game, userV1)) {
      throw new AppError(AppErrorKind.invalidCredentials, 'Access denied');
    }

    return [
      {
        headers: {},
        statusCode: HttpStatus.OK,
      },
      [],
      await this.#gameEventsManagementInputPort.subscribeV1(game.id, publisher),
    ];
  }

  #isUserPlayingGame(game: Game, userV1: apiModels.UserV1): boolean {
    return game.state.slots.some(
      (gameSlot: BaseGameSlot) => gameSlot.userId === userV1.id,
    );
  }
}
