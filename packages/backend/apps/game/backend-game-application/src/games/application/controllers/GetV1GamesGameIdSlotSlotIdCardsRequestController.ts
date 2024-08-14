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
  HttpRequestController,
  MiddlewarePipeline,
  Request,
  Response,
  ResponseWithBody,
  SingleEntityGetResponseBuilder,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { AuthMiddleware } from '../../../auth/application/middlewares/AuthMiddleware';
import { GetV1GamesGameIdSlotSlotIdCardsRequestParamHandler } from '../handlers/GetV1GamesGameIdSlotSlotIdCardsRequestParamHandler';
import { GameMiddleware } from '../middlewares/GameMiddleware';
import { GameSlotManagementInputPort } from '../ports/input/GameSlotManagementInputPort';

@Injectable()
export class GetV1GamesGameIdSlotSlotIdCardsRequestController extends HttpRequestController<
  Request,
  [number, Game, apiModels.UserV1],
  apiModels.ActiveGameSlotCardsV1 | undefined
> {
  readonly #gameSlotManagementInputPort: GameSlotManagementInputPort;

  constructor(
    @Inject(GetV1GamesGameIdSlotSlotIdCardsRequestParamHandler)
    requestParamHandler: Handler<[Request], [number, Game, apiModels.UserV1]>,
    @Inject(SingleEntityGetResponseBuilder)
    responseBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [apiModels.ActiveGameSlotCardsV1 | undefined]
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
    gameSlotIndex: number,
    game: Game,
    user: apiModels.UserV1,
  ): Promise<apiModels.ActiveGameSlotCardsV1 | undefined> {
    if (
      !this.#gameSlotManagementInputPort.isSlotOwner(
        game,
        gameSlotIndex,
        user.id,
      )
    ) {
      throw new AppError(AppErrorKind.invalidCredentials, 'Access denied');
    }

    return this.#gameSlotManagementInputPort.getSlotCards(game, gameSlotIndex);
  }
}
