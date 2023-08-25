import { Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameEventsChannelFromGameIdBuilder
  implements Builder<string, [string]>
{
  public build(gameId: string): string {
    return `v1/games/${gameId}`;
  }
}
