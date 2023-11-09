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
import {
  Game,
  GameCreateQuery,
  GameFindQuery,
  IsValidGameCreateQuerySpec,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { GameCreateQueryFromGameCreateQueryV1Builder } from '../../builders/GameCreateQueryFromGameCreateQueryV1Builder';
import { GameV1FromGameBuilder } from '../../builders/GameV1FromGameBuilder';
import { GameCreatedEventHandler } from '../../handlers/GameCreatedEventHandler';
import { GameIdPassTurnQueryV1Handler } from '../../handlers/GameIdPassTurnQueryV1Handler';
import { GameIdPlayCardsQueryV1Handler } from '../../handlers/GameIdPlayCardsQueryV1Handler';
import { GameCreatedEvent } from '../../models/GameCreatedEvent';
import { GameCreateQueryContext } from '../../models/GameCreateQueryContext';
import {
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
} from '../../ports/output/GamePersistenceOutputPort';

@Injectable()
export class GameManagementInputPort {
  readonly #gameCreateQueryFromGameCreateQueryV1Builder: Builder<
    GameCreateQuery,
    [apiModels.GameCreateQueryV1, GameCreateQueryContext]
  >;

  readonly #gameCreatedEventHandler: Handler<[GameCreatedEvent], void>;
  readonly #gameIdPassTurnQueryV1Handler: Handler<
    [string, apiModels.GameIdPassTurnQueryV1, apiModels.UserV1],
    void
  >;
  readonly #gameIdPlayCardsQueryV1Handler: Handler<
    [string, apiModels.GameIdPlayCardsQueryV1, apiModels.UserV1],
    void
  >;
  readonly #gameV1FromGameBuilder: Builder<apiModels.GameV1, [Game]>;
  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;
  readonly #isValidGameCreateQuerySpec: IsValidGameCreateQuerySpec;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(GameCreatedEventHandler)
    gameCreatedEventHandler: Handler<[GameCreatedEvent], void>,
    @Inject(GameCreateQueryFromGameCreateQueryV1Builder)
    gameCreateQueryFromGameCreateQueryV1Builder: Builder<
      GameCreateQuery,
      [apiModels.GameCreateQueryV1, GameCreateQueryContext]
    >,
    @Inject(GameIdPassTurnQueryV1Handler)
    gameIdPassTurnQueryV1Handler: Handler<
      [string, apiModels.GameIdPassTurnQueryV1, apiModels.UserV1],
      void
    >,
    @Inject(GameIdPlayCardsQueryV1Handler)
    gameIdPlayCardsQueryV1Handler: Handler<
      [string, apiModels.GameIdPlayCardsQueryV1, apiModels.UserV1],
      void
    >,
    @Inject(GameV1FromGameBuilder)
    gameV1FromGameBuilder: Builder<apiModels.GameV1, [Game]>,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(IsValidGameCreateQuerySpec)
    isValidGameCreateQuerySpec: IsValidGameCreateQuerySpec,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#gameCreatedEventHandler = gameCreatedEventHandler;
    this.#gameCreateQueryFromGameCreateQueryV1Builder =
      gameCreateQueryFromGameCreateQueryV1Builder;
    this.#gameIdPassTurnQueryV1Handler = gameIdPassTurnQueryV1Handler;
    this.#gameIdPlayCardsQueryV1Handler = gameIdPlayCardsQueryV1Handler;
    this.#gameV1FromGameBuilder = gameV1FromGameBuilder;
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
    this.#isValidGameCreateQuerySpec = isValidGameCreateQuerySpec;
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async create(
    gameCreateQueryV1: apiModels.GameCreateQueryV1,
  ): Promise<apiModels.GameV1> {
    const gameCreateQuery: GameCreateQuery =
      this.#gameCreateQueryFromGameCreateQueryV1Builder.build(
        gameCreateQueryV1,
        this.#createGameCreationQueryContext(),
      );

    const isValidGameCreateQueryResport: Either<string[], undefined> =
      this.#isValidGameCreateQuerySpec.isSatisfiedOrReport(gameCreateQuery);

    if (!isValidGameCreateQueryResport.isRight) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        ['Unable to create game', ...isValidGameCreateQueryResport.value].join(
          '. ',
        ) + '.',
      );
    }

    const game: Game =
      await this.#gamePersistenceOutputPort.create(gameCreateQuery);

    await this.#gameCreatedEventHandler.handle({
      gameCreateQuery,
    });

    return this.#gameV1FromGameBuilder.build(game);
  }

  public async find(gameFindQuery: GameFindQuery): Promise<apiModels.GameV1[]> {
    const games: Game[] =
      await this.#gamePersistenceOutputPort.find(gameFindQuery);

    return games.map(
      (game: Game): apiModels.GameV1 => this.#gameV1FromGameBuilder.build(game),
    );
  }

  public async findOne(
    gameFindQuery: GameFindQuery,
  ): Promise<apiModels.GameV1 | undefined> {
    const game: Game | undefined =
      await this.#gamePersistenceOutputPort.findOne(gameFindQuery);

    if (game === undefined) {
      return undefined;
    } else {
      return this.#gameV1FromGameBuilder.build(game);
    }
  }

  public async updateOne(
    id: string,
    gameIdUpdateQueryV1: apiModels.GameIdUpdateQueryV1,
    userV1: apiModels.UserV1,
  ): Promise<apiModels.GameV1> {
    switch (gameIdUpdateQueryV1.kind) {
      case 'passTurn':
        await this.#gameIdPassTurnQueryV1Handler.handle(
          id,
          gameIdUpdateQueryV1,
          userV1,
        );
        break;
      case 'playCards':
        await this.#gameIdPlayCardsQueryV1Handler.handle(
          id,
          gameIdUpdateQueryV1,
          userV1,
        );
    }

    return this.#getGameOrThrow(id);
  }

  #createGameCreationQueryContext(): GameCreateQueryContext {
    return {
      gameOptionsId: this.#uuidProviderOutputPort.generateV4(),
      uuid: this.#uuidProviderOutputPort.generateV4(),
    };
  }

  async #getGameOrThrow(id: string): Promise<apiModels.GameV1> {
    const gameFindQuery: GameFindQuery = {
      id,
    };

    const game: apiModels.GameV1 | undefined =
      await this.findOne(gameFindQuery);

    if (game === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `Expecting game "${id}" to be found`,
      );
    }

    return game;
  }
}
