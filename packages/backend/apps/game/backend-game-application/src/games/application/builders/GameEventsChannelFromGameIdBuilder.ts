import { Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameEventsChannelFromGameIdBuilder
  implements Builder<string, [string, number]>
{
  public build(gameId: string, version: number): string {
    return `v${version}/games/${gameId}`;
  }
}
