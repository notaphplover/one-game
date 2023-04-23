import { Injectable } from '@nestjs/common';
import { AppError, AppErrorKind, Handler } from '@one-game-js/backend-common';
import { Request, requestContextProperty } from '@one-game-js/backend-http';

import { Game } from '../../domain/models/Game';
import { GameRequestContextHolder } from '../models/GameRequestContextHolder';

export const GET_GAME_GAME_ID_SLOT_SLOT_ID_REQUEST_PARAM: string = 'slotIndex';

@Injectable()
export class GetGameGameIdSlotSlotIdCardsV1RequestParamHandler
  implements Handler<[Request & GameRequestContextHolder], [number, Game]>
{
  public async handle(
    request: Request & GameRequestContextHolder,
  ): Promise<[number, Game]> {
    const stringifiedSlotIndex: string | undefined =
      request.urlParameters[GET_GAME_GAME_ID_SLOT_SLOT_ID_REQUEST_PARAM];

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

    return [slotIndex, request[requestContextProperty].game];
  }
}
