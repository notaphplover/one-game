import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import { Game, GameFindQuery } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { GameV1FromGameBuilder } from '../../builders/GameV1FromGameBuilder';
import { CreateGameUseCaseHandler } from '../../handlers/CreateGameUseCaseHandler';
import { GameIdDrawCardsQueryV1Handler } from '../../handlers/GameIdDrawCardsQueryV1Handler';
import { GameIdPassTurnQueryV1Handler } from '../../handlers/GameIdPassTurnQueryV1Handler';
import { GameIdPlayCardsQueryV1Handler } from '../../handlers/GameIdPlayCardsQueryV1Handler';
import {
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
} from '../../ports/output/GamePersistenceOutputPort';

@Injectable()
export class GameManagementInputPort {
  readonly #createGameUseCaseHandler: Handler<
    [apiModels.GameCreateQueryV1],
    apiModels.GameV1
  >;
  readonly #gameIdDrawCardsQueryV1Handler: Handler<
    [string, apiModels.GameIdDrawCardsQueryV1, apiModels.UserV1],
    void
  >;
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

  constructor(
    @Inject(CreateGameUseCaseHandler)
    createGameUseCaseHandler: Handler<
      [apiModels.GameCreateQueryV1],
      apiModels.GameV1
    >,
    @Inject(GameIdDrawCardsQueryV1Handler)
    gameIdDrawCardsQueryV1Handler: Handler<
      [string, apiModels.GameIdDrawCardsQueryV1, apiModels.UserV1],
      void
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
  ) {
    this.#createGameUseCaseHandler = createGameUseCaseHandler;
    this.#gameIdDrawCardsQueryV1Handler = gameIdDrawCardsQueryV1Handler;
    this.#gameIdPassTurnQueryV1Handler = gameIdPassTurnQueryV1Handler;
    this.#gameIdPlayCardsQueryV1Handler = gameIdPlayCardsQueryV1Handler;
    this.#gameV1FromGameBuilder = gameV1FromGameBuilder;
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
  }

  public async create(
    gameCreateQueryV1: apiModels.GameCreateQueryV1,
  ): Promise<apiModels.GameV1> {
    return this.#createGameUseCaseHandler.handle(gameCreateQueryV1);
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
      case 'drawCards':
        await this.#gameIdDrawCardsQueryV1Handler.handle(
          id,
          gameIdUpdateQueryV1,
          userV1,
        );
        break;
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
