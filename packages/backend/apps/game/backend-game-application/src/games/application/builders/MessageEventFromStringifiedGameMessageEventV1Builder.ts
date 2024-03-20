import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { GameMessageEvent } from '../models/GameMessageEvent';
import { BaseMessageEventFromStringifiedMessageBuilder } from './BaseMessageEventFromStringifiedGameMessageEventBuilder';
import { GameMessageEventV1FromGameMessageEventBuilder } from './GameMessageEventV1FromGameMessageEventBuilder';

@Injectable()
export class MessageEventFromStringifiedGameMessageEventV1Builder extends BaseMessageEventFromStringifiedMessageBuilder<apiModels.GameMessageEventV1> {
  constructor(
    @Inject(GameMessageEventV1FromGameMessageEventBuilder)
    gameMessageEventV1FromGameMessageEventBuilder: Builder<
      apiModels.GameMessageEventV1,
      [GameMessageEvent]
    >,
  ) {
    super(gameMessageEventV1FromGameMessageEventBuilder);
  }
}
