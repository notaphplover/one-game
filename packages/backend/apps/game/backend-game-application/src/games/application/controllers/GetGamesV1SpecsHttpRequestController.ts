import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import { GameSpecFindQuery } from '@cornie-js/backend-game-domain/games';
import {
  ErrorV1ResponseFromErrorBuilder,
  HttpRequestController,
  MiddlewarePipeline,
  MultipleEntitiesGetResponseBuilder,
  Request,
  Response,
  ResponseWithBody,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { AuthMiddleware } from '../../../auth/application/middlewares/AuthMiddleware';
import { GetGamesV1SpecsRequestParamHandler } from '../handlers/GetGamesV1SpecsRequestParamHandler';
import { GameSpecManagementInputPort } from '../ports/input/GameSpecManagementInputPort';

@Injectable()
export class GetGamesV1SpecsHttpRequestController extends HttpRequestController<
  Request,
  [GameSpecFindQuery],
  apiModels.GameSpecV1[]
> {
  readonly #gameSpecManagementInputPort: GameSpecManagementInputPort;

  constructor(
    @Inject(GetGamesV1SpecsRequestParamHandler)
    getGamesV1SpecsRequestParamHandler: Handler<[Request], [GameSpecFindQuery]>,
    @Inject(MultipleEntitiesGetResponseBuilder)
    multipleEntitiesGetResponseBuilder: Builder<
      ResponseWithBody<unknown>,
      [apiModels.GameSpecV1[]]
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
      getGamesV1SpecsRequestParamHandler,
      multipleEntitiesGetResponseBuilder,
      errorV1ResponseFromErrorBuilder,
      new MiddlewarePipeline([authMiddleware]),
    );

    this.#gameSpecManagementInputPort = gameSpecManagementInputPort;
  }

  protected override async _handleUseCase(
    gameSpecFindQuery: GameSpecFindQuery,
  ): Promise<apiModels.GameSpecV1[]> {
    return this.#gameSpecManagementInputPort.find(gameSpecFindQuery);
  }
}
