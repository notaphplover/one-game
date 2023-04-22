import { Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { AppError, AppErrorKind, Handler } from '@one-game-js/backend-common';
import {
  Auth,
  AuthKind,
  AuthRequestContextHolder,
  Request,
  requestContextProperty,
} from '@one-game-js/backend-http';

@Injectable()
export class GetUserV1MeRequestParamHandler
  implements Handler<[Request & AuthRequestContextHolder], [apiModels.UserV1]>
{
  public async handle(
    request: Request & AuthRequestContextHolder,
  ): Promise<[apiModels.UserV1]> {
    const auth: Auth = request[requestContextProperty].auth;

    if (auth.kind !== AuthKind.user) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Unnable to retrieve user from non user credentials',
      );
    }

    return [auth.user];
  }
}
