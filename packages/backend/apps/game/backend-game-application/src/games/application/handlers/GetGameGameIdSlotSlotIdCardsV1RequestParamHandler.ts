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
export class GetGameGameIdSlotSlotIdCardsV1RequestParamHandler
  implements
    Handler<
      [Request & AuthRequestContextHolder & GameRequestContextHolder],
      [number, Game, apiModels.UserV1]
    >
{
  public static getGameGameIdSlotSlotIdRequestParam: string = 'slotIndex';

  public async handle(
    request: Request & AuthRequestContextHolder & GameRequestContextHolder,
  ): Promise<[number, Game, apiModels.UserV1]> {
    const stringifiedSlotIndex: string | undefined =
      request.urlParameters[
        GetGameGameIdSlotSlotIdCardsV1RequestParamHandler
          .getGameGameIdSlotSlotIdRequestParam
      ];

    if (stringifiedSlotIndex === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unable to obtain request slot index from request url',
      );
    }

    const slotIndex: number = parseInt(stringifiedSlotIndex);

    if (Number.isNaN(slotIndex)) {
      throw new AppError(AppErrorKind.contractViolation, 'Invalid slot index');
    }

    const auth: Auth = request[requestContextProperty].auth;

    if (auth.kind !== AuthKind.user) {
      throw new AppError(
        AppErrorKind.invalidCredentials,
        'Expecting user based credentials',
      );
    }

    return [slotIndex, request[requestContextProperty].game, auth.user];
  }
}
