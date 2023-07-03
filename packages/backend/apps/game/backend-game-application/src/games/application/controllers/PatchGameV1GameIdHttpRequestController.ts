import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  MiddlewarePipeline,
  RequestWithBody,
  Response,
  ResponseWithBody,
  SingleEntityHttpRequestController,
  SingleEntityPatchResponseBuilder,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { AuthMiddleware } from '../../../auth/application/middlewares/AuthMiddleware';
import { PatchGameGameIdV1RequestParamHandler } from '../handlers/PatchGameGameIdV1RequestParamHandler';
import { GameManagementInputPort } from '../ports/input/GameManagementInputPort';

@Injectable()
export class PatchGameV1GameIdHttpRequestController extends SingleEntityHttpRequestController<
  RequestWithBody,
  [string, apiModels.GameIdUpdateQueryV1, apiModels.UserV1],
  apiModels.GameV1
> {
  readonly #gameManagementInputPort: GameManagementInputPort;

  constructor(
    @Inject(PatchGameGameIdV1RequestParamHandler)
    requestParamHandler: Handler<
      [RequestWithBody],
      [string, apiModels.GameIdUpdateQueryV1, apiModels.UserV1]
    >,
    @Inject(SingleEntityPatchResponseBuilder)
    responseBuilder: Builder<Response, [apiModels.GameV1 | undefined]>,
    @Inject(ErrorV1ResponseFromErrorBuilder)
    errorV1ResponseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    @Inject(AuthMiddleware)
    authMiddleware: AuthMiddleware,
    @Inject(GameManagementInputPort)
    gameManagementInputPort: GameManagementInputPort,
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
    gameIdUpdateQueryV1: apiModels.GameIdUpdateQueryV1,
    userV1: apiModels.UserV1,
  ): Promise<apiModels.GameV1> {
    return this.#gameManagementInputPort.updateOne(
      gameId,
      gameIdUpdateQueryV1,
      userV1,
    );
  }
}
