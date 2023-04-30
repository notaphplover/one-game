import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { Injectable } from '@nestjs/common';

export const GET_USER_V1_USER_ID_REQUEST_PARAM: string = 'userId';

@Injectable()
export class GetUserV1UserIdRequestParamHandler
  implements Handler<[Request], [string]>
{
  public async handle(request: Request): Promise<[string]> {
    const userId: string | undefined =
      request.urlParameters[GET_USER_V1_USER_ID_REQUEST_PARAM];

    if (userId === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected error: no user id was found in request params',
      );
    }

    return [userId];
  }
}
