import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@one-game-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  MiddlewarePipeline,
  Request,
  Response,
  ResponseWithBody,
  SingleEntityGetResponseBuilder,
  SingleEntityHttpRequestController,
} from '@one-game-js/backend-http';

import { AuthMiddleware } from '../../../auth/application/middlewares/AuthMiddleware';
import { Game } from '../../domain/models/Game';
import { GetGameGameIdSlotSlotIdCardsV1RequestParamHandler } from '../handlers/GetGameGameIdSlotSlotIdCardsV1RequestParamHandler';
import { GameMiddleware } from '../middlewares/GameMiddleware';
import { GameSlotManagementInputPort } from '../ports/input/GameSlotManagementInputPort';

@Injectable()
export class GetGameGameIdSlotSlotIdCardsV1RequestController extends SingleEntityHttpRequestController<
  Request,
  [number, Game, apiModels.UserV1],
  apiModels.ActiveGameSlotCardsV1
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
