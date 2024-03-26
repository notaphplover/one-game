import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { GameMessageEvent } from '../models/GameMessageEvent';
import { BaseMessageEventFromGameMessageEventBuilder } from './BaseMessageEventFromGameMessageEventBuilder';
import { GameMessageEventV1FromGameMessageEventBuilder } from './GameMessageEventV1FromGameMessageEventBuilder';

@Injectable()
export class MessageEventV1FromGameMessageEventBuilder extends BaseMessageEventFromGameMessageEventBuilder<apiModels.GameMessageEventV1> {
  constructor(
    @Inject(GameMessageEventV1FromGameMessageEventBuilder)
    gameMessageEventV1FromGameMessageEventBuilder: Builder<
      [string | null, apiModels.GameMessageEventV1],
      [GameMessageEvent]
    >,
  ) {
    super(gameMessageEventV1FromGameMessageEventBuilder);
  }
}
