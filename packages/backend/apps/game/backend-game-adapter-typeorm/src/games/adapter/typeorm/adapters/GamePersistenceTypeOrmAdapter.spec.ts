import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { GameSlotPersistenceOutputPort } from '@cornie-js/backend-game-application/games';
import {
  Game,
  GameCreateQuery,
  GameFindQuery,
  GameSlotUpdateQuery,
  GameUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import {
  GameCreateQueryFixtures,
  GameFindQueryFixtures,
  GameUpdateQueryFixtures,
  NonStartedGameFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { CreateGameTypeOrmService } from '../services/CreateGameTypeOrmService';
import { FindGameTypeOrmService } from '../services/FindGameTypeOrmService';
import { UpdateGameTypeOrmService } from '../services/UpdateGameTypeOrmService';
import { GamePersistenceTypeOrmAdapter } from './GamePersistenceTypeOrmAdapter';

describe(GamePersistenceTypeOrmAdapter.name, () => {
  let createGameTypeOrmServiceMock: jest.Mocked<CreateGameTypeOrmService>;
  let findGameTypeOrmServiceMock: jest.Mocked<FindGameTypeOrmService>;
  let gameSlotPersistenceOutputPortMock: jest.Mocked<GameSlotPersistenceOutputPort>;
  let updateGameTypeOrmServiceMock: jest.Mocked<UpdateGameTypeOrmService>;

  let gamePersistenceTypeOrmAdapter: GamePersistenceTypeOrmAdapter;

  beforeAll(() => {
    createGameTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateGameTypeOrmService>
    > as jest.Mocked<CreateGameTypeOrmService>;
    findGameTypeOrmServiceMock = {
      find: jest.fn(),
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<FindGameTypeOrmService>
    > as jest.Mocked<FindGameTypeOrmService>;
    gameSlotPersistenceOutputPortMock = {
      update: jest.fn(),
    } as Partial<
      jest.Mocked<GameSlotPersistenceOutputPort>
    > as jest.Mocked<GameSlotPersistenceOutputPort>;
    updateGameTypeOrmServiceMock = {
      update: jest.fn(),
    } as Partial<
      jest.Mocked<UpdateGameTypeOrmService>
    > as jest.Mocked<UpdateGameTypeOrmService>;

    gamePersistenceTypeOrmAdapter = new GamePersistenceTypeOrmAdapter(
      createGameTypeOrmServiceMock,
      findGameTypeOrmServiceMock,
      gameSlotPersistenceOutputPortMock,
      updateGameTypeOrmServiceMock,
    );
  });

  describe('.create', () => {
    let gameCreateQueryFixture: GameCreateQuery;
    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      gameCreateQueryFixture = GameCreateQueryFixtures.any;
      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called', () => {
      let gameFixture: Game;

      let result: unknown;

      beforeAll(async () => {
        gameFixture = NonStartedGameFixtures.any;

        createGameTypeOrmServiceMock.insertOne.mockResolvedValueOnce(
          gameFixture,
        );

        result = await gamePersistenceTypeOrmAdapter.create(
          gameCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createGameTypeOrmService.insertOne()', () => {
        expect(createGameTypeOrmServiceMock.insertOne).toHaveBeenCalledTimes(1);
        expect(createGameTypeOrmServiceMock.insertOne).toHaveBeenCalledWith(
          gameCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return a Game', () => {
        expect(result).toBe(gameFixture);
      });
    });
  });

  describe('.find', () => {
    let gameFindQueryFixture: GameFindQuery;
    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      gameFindQueryFixture = GameFindQueryFixtures.any;
      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called', () => {
      let gameFixture: Game;

      let result: unknown;

      beforeAll(async () => {
        gameFixture = NonStartedGameFixtures.any;

        findGameTypeOrmServiceMock.find.mockResolvedValueOnce([gameFixture]);

        result = await gamePersistenceTypeOrmAdapter.find(
          gameFindQueryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findGameTypeOrmService.find()', () => {
        expect(findGameTypeOrmServiceMock.find).toHaveBeenCalledTimes(1);
        expect(findGameTypeOrmServiceMock.find).toHaveBeenCalledWith(
          gameFindQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return a Game[]', () => {
        expect(result).toStrictEqual([gameFixture]);
      });
    });
  });

  describe('.findOne', () => {
    let gameFindQueryFixture: GameFindQuery;
    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      gameFindQueryFixture = GameFindQueryFixtures.any;
      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called', () => {
      let gameFixture: Game;

      let result: unknown;

      beforeAll(async () => {
        gameFixture = NonStartedGameFixtures.any;

        findGameTypeOrmServiceMock.findOne.mockResolvedValueOnce(gameFixture);

        result = await gamePersistenceTypeOrmAdapter.findOne(
          gameFindQueryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findGameTypeOrmService.findOne()', () => {
        expect(findGameTypeOrmServiceMock.findOne).toHaveBeenCalledTimes(1);
        expect(findGameTypeOrmServiceMock.findOne).toHaveBeenCalledWith(
          gameFindQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return a Game', () => {
        expect(result).toBe(gameFixture);
      });
    });
  });

  describe('.update', () => {
    describe('having a GameUpdateQuery with no gameSlotUpdateQueries', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;
      let transactionWrapperFixture: TransactionWrapper;

      beforeAll(() => {
        gameUpdateQueryFixture =
          GameUpdateQueryFixtures.withNoGameSlotUpdateQueries;
        transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          updateGameTypeOrmServiceMock.update.mockResolvedValueOnce(undefined);

          result = await gamePersistenceTypeOrmAdapter.update(
            gameUpdateQueryFixture,
            transactionWrapperFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should not call gameSlotPersistenceOutputPort.update', () => {
          expect(
            gameSlotPersistenceOutputPortMock.update,
          ).not.toHaveBeenCalled();
        });

        it('should call updateGameTypeOrmService.update()', () => {
          expect(updateGameTypeOrmServiceMock.update).toHaveBeenCalledTimes(1);
          expect(updateGameTypeOrmServiceMock.update).toHaveBeenCalledWith(
            gameUpdateQueryFixture,
            transactionWrapperFixture,
          );
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('having a GameUpdateQuery with gameSlotUpdateQueries', () => {
      let gameSlotUpdateQueryFixture: GameSlotUpdateQuery;
      let transactionWrapperFixture: TransactionWrapper;

      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture =
          GameUpdateQueryFixtures.withGameSlotUpdateQueriesOne;

        [gameSlotUpdateQueryFixture] =
          gameUpdateQueryFixture.gameSlotUpdateQueries as [GameSlotUpdateQuery];

        transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          gameSlotPersistenceOutputPortMock.update.mockResolvedValueOnce(
            undefined,
          );

          updateGameTypeOrmServiceMock.update.mockResolvedValueOnce(undefined);

          result = await gamePersistenceTypeOrmAdapter.update(
            gameUpdateQueryFixture,
            transactionWrapperFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameSlotPersistenceOutputPort.update', () => {
          expect(
            gameSlotPersistenceOutputPortMock.update,
          ).toHaveBeenCalledTimes(1);
          expect(gameSlotPersistenceOutputPortMock.update).toHaveBeenCalledWith(
            gameSlotUpdateQueryFixture,
            transactionWrapperFixture,
          );
        });

        it('should call updateGameTypeOrmService.update()', () => {
          expect(updateGameTypeOrmServiceMock.update).toHaveBeenCalledTimes(1);
          expect(updateGameTypeOrmServiceMock.update).toHaveBeenCalledWith(
            gameUpdateQueryFixture,
            transactionWrapperFixture,
          );
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
