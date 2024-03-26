import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { GameMessageEvent } from '../models/GameMessageEvent';
import { BaseMessageEventFromGameMessageEventBuilder } from './BaseMessageEventFromGameMessageEventBuilder';
import { GameEventV2FromGameMessageEventBuilder } from './GameEventV2FromGameMessageEventBuilder';

@Injectable()
export class MessageEventV2FromGameMessageEventBuilder extends BaseMessageEventFromGameMessageEventBuilder<apiModels.GameEventV2> {
  constructor(
    @Inject(GameEventV2FromGameMessageEventBuilder)
    gameEventV2FromGameMessageEventBuilder: Builder<
      [string | null, apiModels.GameEventV2],
      [GameMessageEvent]
    >,
  ) {
    super(gameEventV2FromGameMessageEventBuilder);
  }
}
