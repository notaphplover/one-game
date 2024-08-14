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

import { PatchV1UsersMeRequestBodyParamHandler } from './PatchV1UsersMeRequestBodyParamHandler';

@Injectable()
export class PatchV1UsersMeRequestParamHandler
  implements
    Handler<
      [RequestWithBody & AuthRequestContextHolder],
      [apiModels.UserV1, apiModels.UserMeUpdateQueryV1]
    >
{
  readonly #patchUserV1MeRequestBodyParamHandler: Handler<
    [RequestWithBody],
    [apiModels.UserMeUpdateQueryV1]
  >;

  constructor(
    @Inject(PatchV1UsersMeRequestBodyParamHandler)
    patchUserV1MeRequestBodyParamHandler: Handler<
      [RequestWithBody],
      [apiModels.UserMeUpdateQueryV1]
    >,
  ) {
    this.#patchUserV1MeRequestBodyParamHandler =
      patchUserV1MeRequestBodyParamHandler;
  }

  public async handle(
    request: RequestWithBody & AuthRequestContextHolder,
  ): Promise<[apiModels.UserV1, apiModels.UserMeUpdateQueryV1]> {
    const auth: Auth = request[requestContextProperty].auth;

    if (auth.kind !== AuthKind.user) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Unnable to retrieve user from non user credentials',
      );
    }

    const [userMeUpdateQueryV1]: [apiModels.UserMeUpdateQueryV1] =
      await this.#patchUserV1MeRequestBodyParamHandler.handle(request);

    return [auth.user, userMeUpdateQueryV1];
  }
}
