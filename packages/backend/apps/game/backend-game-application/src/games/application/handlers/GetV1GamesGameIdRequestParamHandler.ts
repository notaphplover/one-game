import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetV1GamesGameIdRequestParamHandler
  implements Handler<[Request], [string]>
{
  public static getGameV1GameIdRequestParam: string = 'gameId';

  public async handle(request: Request): Promise<[string]> {
    const gameId: string | undefined =
      request.urlParameters[
        GetV1GamesGameIdRequestParamHandler.getGameV1GameIdRequestParam
      ];

    if (gameId === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected error: no game id was found in request params',
      );
    }

    return [gameId];
  }
}
