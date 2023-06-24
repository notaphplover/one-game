import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
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
import { GameOptionsManagementInputPort } from '../ports/input/GameOptionsManagementInputPort';

@Injectable()
export class GetGameV1GameIdGameOptionsHttpRequestController extends SingleEntityHttpRequestController<
  Request,
  [string],
  apiModels.GameOptionsV1
> {
  readonly #gameOptionsManagementInputPort: GameOptionsManagementInputPort;

  constructor(
    @Inject(GetGameV1GameIdRequestParamHandler)
    requestParamHandler: Handler<[Request], [string]>,
    @Inject(SingleEntityGetResponseBuilder)
    responseBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [apiModels.GameOptionsV1 | undefined]
    >,
    @Inject(ErrorV1ResponseFromErrorBuilder)
    errorV1ResponseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    @Inject(GameOptionsManagementInputPort)
    gameOptionsManagementInputPort: GameOptionsManagementInputPort,
    @Inject(AuthMiddleware)
    authMiddleware: AuthMiddleware,
  ) {
    super(
      requestParamHandler,
      responseBuilder,
      errorV1ResponseFromErrorBuilder,
      new MiddlewarePipeline([authMiddleware]),
    );

    this.#gameOptionsManagementInputPort = gameOptionsManagementInputPort;
  }

  protected async _handleUseCase(
    gameId: string,
  ): Promise<apiModels.GameOptionsV1 | undefined> {
    return this.#gameOptionsManagementInputPort.findOne(gameId);
  }
}
