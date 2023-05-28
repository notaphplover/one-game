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

import { PatchUserMeV1RequestBodyParamHandler } from './PatchUserMeV1RequestBodyParamHandler';

@Injectable()
export class PatchUserMeV1RequestParamHandler
  implements
    Handler<
      [RequestWithBody & AuthRequestContextHolder],
      [apiModels.UserV1, apiModels.UserMeUpdateQueryV1]
    >
{
  readonly #patchUserMeV1RequestBodyParamHandler: Handler<
    [RequestWithBody],
    [apiModels.UserMeUpdateQueryV1]
  >;

  constructor(
    @Inject(PatchUserMeV1RequestBodyParamHandler)
    patchUserMeV1RequestBodyParamHandler: Handler<
      [RequestWithBody],
      [apiModels.UserMeUpdateQueryV1]
    >,
  ) {
    this.#patchUserMeV1RequestBodyParamHandler =
      patchUserMeV1RequestBodyParamHandler;
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
      await this.#patchUserMeV1RequestBodyParamHandler.handle(request);

    return [auth.user, userMeUpdateQueryV1];
  }
}
