import { Handler } from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  GameInitialSnapshotCreateQuery,
  GameInitialSnapshotSlotCreateQuery,
} from '@cornie-js/backend-game-domain/gameSnapshots';
import { Inject, Injectable } from '@nestjs/common';

import {
  GameInitialSnapshotPersistenceOutputPort,
  gameInitialSnapshotPersistenceOutputPortSymbol,
} from '../ports/output/GameInitialSnapshotPersistenceOutputPort';
import {
  GameInitialSnapshotSlotPersistenceOutputPort,
  gameInitialSnapshotSlotPersistenceOutputPortSymbol,
} from '../ports/output/GameInitialSnapshotSlotPersistenceOutputPort';

@Injectable()
export class CreateGameInitialSnapshotUseCaseHandler
  implements
    Handler<
      [GameInitialSnapshotCreateQuery, TransactionWrapper | undefined],
      void
    >
{
  readonly #gameInitialSnapshotPersistenceOutputPort: GameInitialSnapshotPersistenceOutputPort;
  readonly #gameInitialSnapshotSlotPersistenceOutputPort: GameInitialSnapshotSlotPersistenceOutputPort;

  constructor(
    @Inject(gameInitialSnapshotPersistenceOutputPortSymbol)
    gameInitialSnapshotPersistenceOutputPort: GameInitialSnapshotPersistenceOutputPort,
    @Inject(gameInitialSnapshotSlotPersistenceOutputPortSymbol)
    gameInitialSnapshotSlotPersistenceOutputPort: GameInitialSnapshotSlotPersistenceOutputPort,
  ) {
    this.#gameInitialSnapshotPersistenceOutputPort =
      gameInitialSnapshotPersistenceOutputPort;
    this.#gameInitialSnapshotSlotPersistenceOutputPort =
      gameInitialSnapshotSlotPersistenceOutputPort;
  }

  public async handle(
    gameInitialSnapshotCreateQuery: GameInitialSnapshotCreateQuery,
    transactionWrapper: TransactionWrapper | undefined,
  ): Promise<void> {
    await this.#gameInitialSnapshotPersistenceOutputPort.create(
      gameInitialSnapshotCreateQuery,
      transactionWrapper,
    );

    await Promise.all(
      gameInitialSnapshotCreateQuery.gameSlotCreateQueries.map(
        async (
          gameInitialSnapshotSlotCreateQuery: GameInitialSnapshotSlotCreateQuery,
        ) =>
          this.#gameInitialSnapshotSlotPersistenceOutputPort.create(
            gameInitialSnapshotSlotCreateQuery,
            transactionWrapper,
          ),
      ),
    );
  }
}
