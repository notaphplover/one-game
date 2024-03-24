import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { GameAction } from '@cornie-js/backend-game-domain/gameActions';
import { MessageEvent } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { GameEventV2FromGameActionBuilder } from '../../../games/application/builders/GameEventV2FromGameActionBuilder';

@Injectable()
export class MessageEventFromGameActionBuilder
  implements Builder<MessageEvent, [GameAction]>
{
  readonly #gameEventV2FromGameActionBuilder: Builder<
    [string | null, apiModels.GameEventV2],
    [GameAction]
  >;

  constructor(
    @Inject(GameEventV2FromGameActionBuilder)
    gameEventV2FromGameActionBuilder: Builder<
      [string | null, apiModels.GameEventV2],
      [GameAction]
    >,
  ) {
    this.#gameEventV2FromGameActionBuilder = gameEventV2FromGameActionBuilder;
  }

  public build(gameAction: GameAction): MessageEvent {
    const [id, messageEventData]: [string | null, apiModels.GameEventV2] =
      this.#gameEventV2FromGameActionBuilder.build(gameAction);

    const messageEvent: MessageEvent = {
      data: JSON.stringify(messageEventData),
    };

    if (id !== null) {
      messageEvent.id = id;
    }

    return messageEvent;
  }
}
