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
  Request,
  Response,
  ResponseWithBody,
  SingleEntityGetResponseBuilder,
  HttpRequestController,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { AuthMiddleware } from '../../../auth/application/middlewares/AuthMiddleware';
import { GetGameGameIdSlotSlotIdCardsV1RequestParamHandler } from '../handlers/GetGameGameIdSlotSlotIdCardsV1RequestParamHandler';
import { GameMiddleware } from '../middlewares/GameMiddleware';
import { GameSlotManagementInputPort } from '../ports/input/GameSlotManagementInputPort';

@Injectable()
export class GetGameGameIdSlotSlotIdCardsV1RequestController extends HttpRequestController<
  Request,
  [number, Game, apiModels.UserV1],
  apiModels.ActiveGameSlotCardsV1 | undefined
> {
  readonly #gameSlotManagementInputPort: GameSlotManagementInputPort;

  constructor(
    @Inject(GetGameGameIdSlotSlotIdCardsV1RequestParamHandler)
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
