import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { Injectable } from '@nestjs/common';

export const GET_GAME_V1_GAME_ID_REQUEST_PARAM: string = 'gameId';

@Injectable()
export class GetGameV1GameIdRequestParamHandler
  implements Handler<[Request], [string]>
{
  public async handle(request: Request): Promise<[string]> {
    const gameId: string | undefined =
      request.urlParameters[GET_GAME_V1_GAME_ID_REQUEST_PARAM];

    if (gameId === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected error: no game id was found in request params',
      );
    }

    return [gameId];
  }
}
