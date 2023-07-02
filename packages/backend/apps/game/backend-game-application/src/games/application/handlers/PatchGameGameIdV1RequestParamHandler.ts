import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import {
  Auth,
  AuthKind,
  AuthRequestContextHolder,
  RequestWithBody,
  requestContextProperty,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { PatchGameGameIdV1RequestBodyParamHandler } from './PatchGameGameIdV1RequestBodyParamHandler';

export const PATCH_GAME_V1_GAME_ID_REQUEST_PARAM: string = 'gameId';

@Injectable()
export class PatchGameGameIdV1RequestParamHandler {
  readonly #patchGameGameIdV1RequestBodyParamHandler: Handler<
    [RequestWithBody],
    [apiModels.GameIdUpdateQueryV1]
  >;

  constructor(
    @Inject(PatchGameGameIdV1RequestBodyParamHandler)
    patchGameGameIdV1RequestBodyParamHandler: Handler<
      [RequestWithBody],
      [apiModels.GameIdUpdateQueryV1]
    >,
  ) {
    this.#patchGameGameIdV1RequestBodyParamHandler =
      patchGameGameIdV1RequestBodyParamHandler;
  }

  public async handle(
    request: RequestWithBody & AuthRequestContextHolder,
  ): Promise<[apiModels.UserV1, apiModels.GameIdUpdateQueryV1]> {
    const auth: Auth = request[requestContextProperty].auth;

    if (auth.kind !== AuthKind.user) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Unnable to retrieve user from non user credentials',
      );
    }

    const [gameIdUpdateQueryV1]: [apiModels.GameIdUpdateQueryV1] =
      await this.#patchGameGameIdV1RequestBodyParamHandler.handle(request);

    return [auth.user, gameIdUpdateQueryV1];
  }
}
