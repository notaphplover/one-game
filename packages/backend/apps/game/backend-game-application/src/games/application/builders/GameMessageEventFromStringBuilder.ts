import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { BaseGameMessageEvent } from '../models/BaseGameMessageEvent';
import { GameMessageEvent } from '../models/GameMessageEvent';
import { GameMessageEventKind } from '../models/GameMessageEventKind';

@Injectable()
export class GameMessageEventFromStringBuilder
  implements Builder<GameMessageEvent, [string]>
{
  public build(stringifiedGameMessageEvent: string): GameMessageEvent {
    const gameMessageEvent: unknown = JSON.parse(stringifiedGameMessageEvent);

    if (!this.#isBaseGameMessageEvent(gameMessageEvent)) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected invalid game message event',
      );
    }

    return gameMessageEvent as GameMessageEvent;
  }

  #isBaseGameMessageEvent(value: unknown): value is BaseGameMessageEvent {
    return (
      value !== null &&
      typeof value === 'object' &&
      Object.values(GameMessageEventKind).includes(
        (value as BaseGameMessageEvent).kind,
      )
    );
  }
}
