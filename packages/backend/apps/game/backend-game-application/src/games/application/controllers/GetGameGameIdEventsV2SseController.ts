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
import { GameActionManagementInputPort } from '../../../gameActions/application/ports/input/GameActionManagementInputPort';
import { GetGameGameIdEventsV2RequestParamHandler } from '../handlers/GetGameGameIdEventsV2RequestParamHandler';
import { GameMiddleware } from '../middlewares/GameMiddleware';
import { GameRequestContextHolder } from '../models/GameRequestContextHolder';
import { GameEventsManagementInputPort } from '../ports/input/GameEventsManagementInputPort';

@Injectable()
export class GetGameGameIdEventsV2SseController extends HttpSseRequestController<
  Request & AuthRequestContextHolder & GameRequestContextHolder,
  [Game, apiModels.UserV1, string | null]
> {
  readonly #gameActionsManagementInputPort: GameActionManagementInputPort;
  readonly #gameEventsManagementInputPort: GameEventsManagementInputPort;

  constructor(
    @Inject(GetGameGameIdEventsV2RequestParamHandler)
    getGameGameIdEventsV1RequestParamHandler: Handler<
      [Request & AuthRequestContextHolder & GameRequestContextHolder],
      [Game, apiModels.UserV1, string | null]
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
    @Inject(GameActionManagementInputPort)
    gameActionsManagementInputPort: GameActionManagementInputPort,
    @Inject(GameEventsManagementInputPort)
    gameEventsManagementInputPort: GameEventsManagementInputPort,
  ) {
    super(
      getGameGameIdEventsV1RequestParamHandler,
      responseFromErrorBuilder,
      new MiddlewarePipeline([authMiddleware, gameMiddleware]),
    );

    this.#gameActionsManagementInputPort = gameActionsManagementInputPort;
    this.#gameEventsManagementInputPort = gameEventsManagementInputPort;
  }

  protected override async _handleUseCase(
    publisher: SsePublisher,
    game: Game,
    userV1: apiModels.UserV1,
    lastEventId: string | null,
  ): Promise<[Response, MessageEvent[], SseTeardownExecutor]> {
    if (!this.#isUserPlayingGame(game, userV1)) {
      throw new AppError(AppErrorKind.invalidCredentials, 'Access denied');
    }

    const previousMessageEvents: MessageEvent[] =
      await this.#gameActionsManagementInputPort.findNextGameEvents(
        game.id,
        lastEventId,
      );

    return [
      {
        headers: {},
        statusCode: HttpStatus.OK,
      },
      previousMessageEvents,
      await this.#gameEventsManagementInputPort.subscribeV2(game.id, publisher),
    ];
  }

  #isUserPlayingGame(game: Game, userV1: apiModels.UserV1): boolean {
    return game.state.slots.some(
      (gameSlot: BaseGameSlot) => gameSlot.userId === userV1.id,
    );
  }
}
