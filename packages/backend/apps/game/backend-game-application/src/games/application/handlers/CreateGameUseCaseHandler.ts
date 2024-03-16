import { models as apiModels } from '@cornie-js/api-models';
import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import {
  AppError,
  AppErrorKind,
  Builder,
  Either,
  Handler,
} from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  Game,
  GameCreateQuery,
  IsValidGameCreateQuerySpec,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import {
  TransactionProvisionOutputPort,
  transactionProvisionOutputPortSymbol,
} from '../../../foundation/db/application/ports/output/TransactionProvisionOutputPort';
import { GameCreateQueryFromGameCreateQueryV1Builder } from '../builders/GameCreateQueryFromGameCreateQueryV1Builder';
import { GameV1FromGameBuilder } from '../builders/GameV1FromGameBuilder';
import { GameCreateQueryContext } from '../models/GameCreateQueryContext';
import {
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
} from '../ports/output/GamePersistenceOutputPort';
import {
  GameSpecPersistenceOutputPort,
  gameSpecPersistenceOutputPortSymbol,
} from '../ports/output/GameSpecPersistenceOutputPort';

@Injectable()
export class CreateGameUseCaseHandler
  implements Handler<[apiModels.GameCreateQueryV1], apiModels.GameV1>
{
  readonly #gameCreateQueryFromGameCreateQueryV1Builder: Builder<
    GameCreateQuery,
    [apiModels.GameCreateQueryV1, GameCreateQueryContext]
  >;
  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;
  readonly #gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort;
  readonly #gameV1FromGameBuilder: Builder<apiModels.GameV1, [Game]>;
  readonly #isValidGameCreateQuerySpec: IsValidGameCreateQuerySpec;
  readonly #transactionProvisionOutputPort: TransactionProvisionOutputPort;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(GameCreateQueryFromGameCreateQueryV1Builder)
    gameCreateQueryFromGameCreateQueryV1Builder: Builder<
      GameCreateQuery,
      [apiModels.GameCreateQueryV1, GameCreateQueryContext]
    >,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(gameSpecPersistenceOutputPortSymbol)
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
    @Inject(GameV1FromGameBuilder)
    gameV1FromGameBuilder: Builder<apiModels.GameV1, [Game]>,
    @Inject(IsValidGameCreateQuerySpec)
    isValidGameCreateQuerySpec: IsValidGameCreateQuerySpec,
    @Inject(transactionProvisionOutputPortSymbol)
    transactionProvisionOutputPort: TransactionProvisionOutputPort,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#gameCreateQueryFromGameCreateQueryV1Builder =
      gameCreateQueryFromGameCreateQueryV1Builder;
    this.#gameSpecPersistenceOutputPort = gameSpecPersistenceOutputPort;
    this.#gameV1FromGameBuilder = gameV1FromGameBuilder;
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
    this.#isValidGameCreateQuerySpec = isValidGameCreateQuerySpec;
    this.#transactionProvisionOutputPort = transactionProvisionOutputPort;
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async handle(
    gameCreateQueryV1: apiModels.GameCreateQueryV1,
  ): Promise<apiModels.GameV1> {
    const gameCreateQuery: GameCreateQuery =
      this.#gameCreateQueryFromGameCreateQueryV1Builder.build(
        gameCreateQueryV1,
        this.#createGameCreationQueryContext(),
      );

    this.#validate(gameCreateQuery);

    await using transactionWrapper: TransactionWrapper =
      await this.#transactionProvisionOutputPort.provide();

    const game: Game = await this.#gamePersistenceOutputPort.create(
      gameCreateQuery,
      transactionWrapper,
    );

    await this.#gameSpecPersistenceOutputPort.create(
      gameCreateQuery.spec,
      transactionWrapper,
    );

    await transactionWrapper.tryCommit();

    return this.#gameV1FromGameBuilder.build(game);
  }

  #createGameCreationQueryContext(): GameCreateQueryContext {
    return {
      gameOptionsId: this.#uuidProviderOutputPort.generateV4(),
      gameSpecId: this.#uuidProviderOutputPort.generateV4(),
      uuid: this.#uuidProviderOutputPort.generateV4(),
    };
  }

  #validate(gameCreateQuery: GameCreateQuery): void {
    const isValidGameCreateQueryReport: Either<string[], undefined> =
      this.#isValidGameCreateQuerySpec.isSatisfiedOrReport(gameCreateQuery);

    if (!isValidGameCreateQueryReport.isRight) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        ['Unable to create game', ...isValidGameCreateQueryReport.value].join(
          '. ',
        ) + '.',
      );
    }
  }
}
