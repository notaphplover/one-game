import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import {
  Auth,
  AuthKind,
  AuthRequestContextHolder,
  Request,
  requestContextProperty,
} from '@cornie-js/backend-http';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteUserV1MeRequestParamHandler
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
