import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import {
  Auth,
  AuthKind,
  AuthRequestContextHolder,
  requestContextProperty,
  RequestWithBody,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { PatchGameGameIdV1RequestBodyParamHandler } from './PatchGameGameIdV1RequestBodyParamHandler';

@Injectable()
export class PatchGameGameIdV1RequestParamHandler
  implements
    Handler<
      [RequestWithBody & AuthRequestContextHolder],
      [string, apiModels.GameIdUpdateQueryV1, apiModels.UserV1]
    >
{
  public static patchGameV1GameIdRequestParam: string = 'gameId';

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
  ): Promise<[string, apiModels.GameIdUpdateQueryV1, apiModels.UserV1]> {
    const gameId: string | undefined =
      request.urlParameters[
        PatchGameGameIdV1RequestParamHandler.patchGameV1GameIdRequestParam
      ];

    if (gameId === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected error: no game id was found in request params',
      );
    }

    const auth: Auth = request[requestContextProperty].auth;

    if (auth.kind !== AuthKind.user) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Unnable to retrieve user from non user credentials',
      );
    }

    const [gameIdUpdateQueryV1]: [apiModels.GameIdUpdateQueryV1] =
      await this.#patchGameGameIdV1RequestBodyParamHandler.handle(request);

    return [gameId, gameIdUpdateQueryV1, auth.user];
  }
}
