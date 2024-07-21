import { PulsarConsumer } from '@cornie-js/backend-adapter-pulsar';
import {
  GameManagementInputPort,
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
  GameTurnEndSignalMessage,
} from '@cornie-js/backend-game-application/games';
import { Game, GameStatus } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { Consumer } from 'pulsar-client';

import { gameTurnEndSignalConsumerSymbol } from '../../nest/models/gameTurnEndSignalConsumerSymbol';

@Injectable()
export class GameTurnEndSignalMessageConsumer extends PulsarConsumer<GameTurnEndSignalMessage> {
  readonly #gameManagementInputPort: GameManagementInputPort;
  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;

  constructor(
    @Inject(gameTurnEndSignalConsumerSymbol)
    consumer: Consumer,
    @Inject(GameManagementInputPort)
    gameManagementInputPort: GameManagementInputPort,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
  ) {
    super(consumer);

    this.#gameManagementInputPort = gameManagementInputPort;
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
  }

  protected override async _handleMessage(
    message: GameTurnEndSignalMessage,
  ): Promise<void> {
    const isRightGameToAutoUpdate: boolean =
      await this.#isRightGameToAutoUpdate(message);

    if (isRightGameToAutoUpdate) {
      await this.#gameManagementInputPort.updateGameWithAutoPlay(
        message.gameId,
      );
    }
  }

  async #isRightGameToAutoUpdate(
    message: GameTurnEndSignalMessage,
  ): Promise<boolean> {
    const game: Game | undefined =
      await this.#gamePersistenceOutputPort.findOne({
        id: message.gameId,
      });

    return (
      game !== undefined &&
      game.state.status === GameStatus.active &&
      game.state.turn === message.turn
    );
  }
}
