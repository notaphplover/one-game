import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  GameAction,
  GameActionFindQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import { Inject, Injectable } from '@nestjs/common';

import {
  GameActionPersistenceOutputPort,
  gameActionPersistenceOutputPortSymbol,
} from '../output/GameActionPersistenceOutputPort';

const MAX_PREVIOUS_GAME_ACTIONS: number = 20;

@Injectable()
export class GameActionManagementInputPort {
  readonly #gameActionPersistenceOutputPort: GameActionPersistenceOutputPort;

  constructor(
    @Inject(gameActionPersistenceOutputPortSymbol)
    gameActionPersistenceOutputPort: GameActionPersistenceOutputPort,
  ) {
    this.#gameActionPersistenceOutputPort = gameActionPersistenceOutputPort;
  }

  public async findPrevious(id: string): Promise<GameAction[]> {
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

    return previousGameActions;
  }
}
