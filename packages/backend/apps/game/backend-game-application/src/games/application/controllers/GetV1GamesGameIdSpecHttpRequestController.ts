import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
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
import { GetV1GamesGameIdRequestParamHandler } from '../handlers/GetV1GamesGameIdRequestParamHandler';
import { GameSpecManagementInputPort } from '../ports/input/GameSpecManagementInputPort';

@Injectable()
export class GetV1GamesGameIdSpecHttpRequestController extends HttpRequestController<
  Request,
  [string],
  apiModels.GameSpecV1 | undefined
> {
  readonly #gameSpecManagementInputPort: GameSpecManagementInputPort;

  constructor(
    @Inject(GetV1GamesGameIdRequestParamHandler)
    requestParamHandler: Handler<[Request], [string]>,
    @Inject(SingleEntityGetResponseBuilder)
    responseBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [apiModels.GameSpecV1 | undefined]
    >,
    @Inject(ErrorV1ResponseFromErrorBuilder)
    errorV1ResponseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    @Inject(GameSpecManagementInputPort)
    gameSpecManagementInputPort: GameSpecManagementInputPort,
    @Inject(AuthMiddleware)
    authMiddleware: AuthMiddleware,
  ) {
    super(
      requestParamHandler,
      responseBuilder,
      errorV1ResponseFromErrorBuilder,
      new MiddlewarePipeline([authMiddleware]),
    );

    this.#gameSpecManagementInputPort = gameSpecManagementInputPort;
  }

  protected async _handleUseCase(
    gameId: string,
  ): Promise<apiModels.GameSpecV1 | undefined> {
    return this.#gameSpecManagementInputPort.findOne({ gameIds: [gameId] });
  }
}
