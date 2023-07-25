import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserV1UserIdRequestParamHandler
  implements Handler<[Request], [string]>
{
  public static userIdRequestParam: string = 'userId';

  public async handle(request: Request): Promise<[string]> {
    const userId: string | undefined =
      request.urlParameters[
        GetUserV1UserIdRequestParamHandler.userIdRequestParam
      ];

    if (userId === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected error: no user id was found in request params',
      );
    }

    return [userId];
  }
}
