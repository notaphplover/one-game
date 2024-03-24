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

  public async findNextGameEvents(
    gameId: string,
    lastGameActionId: string | null,
  ): Promise<MessageEvent[]> {
    const previousGameActionsFindQuery: GameActionFindQuery =
      await this.#buildFindQuery(gameId, lastGameActionId);

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

  async #buildFindQuery(
    gameId: string,
    lastGameActionId: string | null,
  ): Promise<GameActionFindQuery> {
    const previousGameActionsFindQuery: GameActionFindQuery = {
      gameId,
      limit: MAX_PREVIOUS_GAME_ACTIONS + 1,
    };

    if (lastGameActionId !== null) {
      const gameAction: GameAction = await this.#getGameAction(
        gameId,
        lastGameActionId,
      );

      previousGameActionsFindQuery.position = {
        gt: gameAction.position,
      };
    }

    return previousGameActionsFindQuery;
  }

  async #getGameAction(gameId: string, id: string): Promise<GameAction> {
    const gameAction: GameAction | undefined =
      await this.#gameActionPersistenceOutputPort.findOne({
        id: id,
      });

    if (gameAction === undefined) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Unable to find previous game actions. No game action with id "${id}" was found`,
      );
    }

    if (gameAction.gameId !== gameId) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Unable to find previous game actions. Game action "${id}" does not belong to game "${gameId}"`,
      );
    }

    return gameAction;
  }
}
