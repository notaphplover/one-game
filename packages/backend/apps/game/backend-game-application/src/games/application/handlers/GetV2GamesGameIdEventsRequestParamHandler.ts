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

const LAST_EVENT_ID_HEADER: string = 'last-event-id';

@Injectable()
export class GetV2GamesGameIdEventsRequestParamHandler
  implements
    Handler<
      [Request & AuthRequestContextHolder & GameRequestContextHolder],
      [Game, apiModels.UserV1, string | null]
    >
{
  public async handle(
    request: Request & AuthRequestContextHolder & GameRequestContextHolder,
  ): Promise<[Game, apiModels.UserV1, string | null]> {
    const game: Game = request[requestContextProperty].game;
    const auth: Auth = request[requestContextProperty].auth;

    const lastEventId: string | null =
      request.headers[LAST_EVENT_ID_HEADER] ?? null;

    if (auth.kind !== AuthKind.user) {
      throw new AppError(
        AppErrorKind.invalidCredentials,
        'Expecting user based credentials',
      );
    }

    return [game, auth.user, lastEventId];
  }
}
