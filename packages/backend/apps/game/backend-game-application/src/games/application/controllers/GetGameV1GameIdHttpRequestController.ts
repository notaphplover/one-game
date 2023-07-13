import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import { GameFindQuery } from '@cornie-js/backend-game-domain/games';
import {
  ErrorV1ResponseFromErrorBuilder,
  MiddlewarePipeline,
  Request,
  Response,
  ResponseWithBody,
  SingleEntityGetResponseBuilder,
  SingleEntityHttpRequestController,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { AuthMiddleware } from '../../../auth/application/middlewares/AuthMiddleware';
import { GetGameV1GameIdRequestParamHandler } from '../handlers/GetGameV1GameIdRequestParamHandler';
import { GameManagementInputPort } from '../ports/input/GameManagementInputPort';

@Injectable()
export class GetGameV1GameIdHttpRequestController extends SingleEntityHttpRequestController<
  Request,
  [string],
  apiModels.GameV1
> {
  readonly #gameManagementInputPort: GameManagementInputPort;

  constructor(
    @Inject(GetGameV1GameIdRequestParamHandler)
    requestParamHandler: Handler<[Request], [string]>,
    @Inject(SingleEntityGetResponseBuilder)
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
    gameId: string,
  ): Promise<apiModels.GameV1 | undefined> {
    const gameFindQuery: GameFindQuery = {
      id: gameId,
    };

    return this.#gameManagementInputPort.findOne(gameFindQuery);
  }
}
