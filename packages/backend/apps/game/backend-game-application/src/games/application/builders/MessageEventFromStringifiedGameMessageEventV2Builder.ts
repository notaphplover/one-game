import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { GameMessageEvent } from '../models/GameMessageEvent';
import { BaseMessageEventFromStringifiedMessageBuilder } from './BaseMessageEventFromStringifiedGameMessageEventBuilder';
import { GameEventV2FromGameMessageEventBuilder } from './GameEventV2FromGameMessageEventBuilder';

@Injectable()
export class MessageEventFromStringifiedGameMessageEventV2Builder extends BaseMessageEventFromStringifiedMessageBuilder<apiModels.GameEventV2> {
  constructor(
    @Inject(GameEventV2FromGameMessageEventBuilder)
    gameEventV2FromGameMessageEventBuilder: Builder<
      apiModels.GameEventV2,
      [GameMessageEvent]
    >,
  ) {
    super(gameEventV2FromGameMessageEventBuilder);
  }
}
