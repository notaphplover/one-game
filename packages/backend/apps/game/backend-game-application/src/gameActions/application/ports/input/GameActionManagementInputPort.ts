import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import {
  GameAction,
  GameActionFindQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import { MessageEvent } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { MessageEventFromGameActionBuilder } from '../../builders/MessageEventFromGameActionBuilder';
import {
  GameActionPersistenceOutputPort,
  gameActionPersistenceOutputPortSymbol,
} from '../output/GameActionPersistenceOutputPort';

const MAX_PREVIOUS_GAME_ACTIONS: number = 20;

@Injectable()
export class GameActionManagementInputPort {
  readonly #gameActionPersistenceOutputPort: GameActionPersistenceOutputPort;
  readonly #messageEventFromGameActionBuilder: Builder<
    MessageEvent,
    [GameAction]
  >;

  constructor(
    @Inject(gameActionPersistenceOutputPortSymbol)
    gameActionPersistenceOutputPort: GameActionPersistenceOutputPort,
    @Inject(MessageEventFromGameActionBuilder)
    messageEventFromGameActionBuilder: Builder<MessageEvent, [GameAction]>,
  ) {
    this.#gameActionPersistenceOutputPort = gameActionPersistenceOutputPort;
    this.#messageEventFromGameActionBuilder = messageEventFromGameActionBuilder;
  }

  public async findNextEventsByGameActionId(
    id: string,
  ): Promise<MessageEvent[]> {
    const gameAction: GameAction | undefined =
      await this.#gameActionPersistenceOutputPort.findOne({
        id,
      });

    if (gameAction === undefined) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Unable to find previous game actions. No game action with id "${id}" was found`,
      );
    }

    const previousGameActionsFindQuery: GameActionFindQuery = {
      limit: MAX_PREVIOUS_GAME_ACTIONS + 1,
      position: {
        gt: gameAction.position,
      },
    };

    const previousGameActions: GameAction[] =
      await this.#gameActionPersistenceOutputPort.find(
        previousGameActionsFindQuery,
      );

    if (previousGameActions.length > MAX_PREVIOUS_GAME_ACTIONS) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Unable to retrieve more than ${MAX_PREVIOUS_GAME_ACTIONS} previous game actions`,
      );
    }

    return previousGameActions.map((gameAction: GameAction) =>
      this.#messageEventFromGameActionBuilder.build(gameAction),
    );
  }
}
