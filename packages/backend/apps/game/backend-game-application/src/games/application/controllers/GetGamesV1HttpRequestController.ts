import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import { GameFindQuery } from '@cornie-js/backend-game-domain/games';
import {
  ErrorV1ResponseFromErrorBuilder,
  HttpRequestController,
  MiddlewarePipeline,
  MultipleEntitiesGetResponseBuilder,
  Request,
  Response,
  ResponseWithBody,
} from '@cornie-js/backend-http';
import { Inject } from '@nestjs/common';

import { AuthMiddleware } from '../../../auth/application/middlewares/AuthMiddleware';
import { GetGamesV1RequestParamHandler } from '../handlers/GetGamesV1RequestParamHandler';
import { GameManagementInputPort } from '../ports/input/GameManagementInputPort';

export class GetGamesV1HttpRequestController extends HttpRequestController<
  Request,
  [GameFindQuery],
  apiModels.GameV1[]
> {
  readonly #gameManagementInputPort: GameManagementInputPort;

  constructor(
    @Inject(GetGamesV1RequestParamHandler)
    requestParamHandler: Handler<[Request], [GameFindQuery]>,
    @Inject(MultipleEntitiesGetResponseBuilder)
    responseBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [apiModels.GameV1[]]
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
    gameFindQuery: GameFindQuery,
  ): Promise<apiModels.GameV1[]> {
    return this.#gameManagementInputPort.find(gameFindQuery);
  }
}
