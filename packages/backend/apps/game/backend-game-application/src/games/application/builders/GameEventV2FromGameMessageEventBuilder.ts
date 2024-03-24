import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { GameAction } from '@cornie-js/backend-game-domain/gameActions';
import { Inject, Injectable } from '@nestjs/common';

import { GameMessageEvent } from '../models/GameMessageEvent';
import { GameMessageEventKind } from '../models/GameMessageEventKind';
import { GameUpdatedMessageEvent } from '../models/GameUpdatedMessageEvent';
import { GameEventV2FromGameActionBuilder } from './GameEventV2FromGameActionBuilder';

@Injectable()
export class GameEventV2FromGameMessageEventBuilder
  implements
    Builder<[string | null, apiModels.GameEventV2], [GameMessageEvent]>
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

  public build(
    gameMessageEvent: GameMessageEvent,
  ): [string | null, apiModels.GameEventV2] {
    switch (gameMessageEvent.kind) {
      case GameMessageEventKind.gameUpdated:
        return this.#buildFromGameUpdatedMessageEvent(gameMessageEvent);
    }
  }

  #buildFromGameUpdatedMessageEvent(
    gameUpdatedMessageEvent: GameUpdatedMessageEvent,
  ): [string | null, apiModels.GameEventV2] {
    return this.#gameEventV2FromGameActionBuilder.build(
      gameUpdatedMessageEvent.gameAction,
    );
  }
}
