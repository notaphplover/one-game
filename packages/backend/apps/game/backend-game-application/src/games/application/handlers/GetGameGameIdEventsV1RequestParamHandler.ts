import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import { Game } from '@cornie-js/backend-game-domain/games';
import {
  Auth,
  AuthKind,
  AuthRequestContextHolder,
  Request,
  requestContextProperty,
} from '@cornie-js/backend-http';
import { Injectable } from '@nestjs/common';

import { GameRequestContextHolder } from '../models/GameRequestContextHolder';

@Injectable()
export class GetGameGameIdEventsV1RequestParamHandler
  implements
    Handler<
      [Request & AuthRequestContextHolder & GameRequestContextHolder],
      [Game, apiModels.UserV1]
    >
{
  public async handle(
    request: Request & AuthRequestContextHolder & GameRequestContextHolder,
  ): Promise<[Game, apiModels.UserV1]> {
    const auth: Auth = request[requestContextProperty].auth;

    if (auth.kind !== AuthKind.user) {
      throw new AppError(
        AppErrorKind.invalidCredentials,
        'Expecting user based credentials',
      );
    }

    return [request[requestContextProperty].game, auth.user];
  }
}
