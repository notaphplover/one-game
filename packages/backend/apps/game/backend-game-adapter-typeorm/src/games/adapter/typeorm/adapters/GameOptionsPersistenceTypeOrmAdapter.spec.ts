import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  GameOptions,
  GameOptionsCreateQuery,
  GameOptionsFindQuery,
} from '@cornie-js/backend-game-domain/games';
import {
  GameOptionsCreateQueryFixtures,
  GameOptionsFindQueryFixtures,
  GameOptionsFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { CreateGameOptionsTypeOrmService } from '../services/CreateGameOptionsTypeOrmService';
import { FindGameOptionsTypeOrmService } from '../services/FindGameOptionsTypeOrmService';
import { GameOptionsPersistenceTypeOrmAdapter } from './GameOptionsPersistenceTypeOrmAdapter';

describe(GameOptionsPersistenceTypeOrmAdapter.name, () => {
  let createGameOptionsTypeOrmServiceMock: jest.Mocked<CreateGameOptionsTypeOrmService>;
  let findGameOptionsTypeOrmServiceMock: jest.Mocked<FindGameOptionsTypeOrmService>;

  let gameOptionsPersistenceTypeOrmAdapter: GameOptionsPersistenceTypeOrmAdapter;

  beforeAll(() => {
    createGameOptionsTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateGameOptionsTypeOrmService>
    > as jest.Mocked<CreateGameOptionsTypeOrmService>;

    findGameOptionsTypeOrmServiceMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<FindGameOptionsTypeOrmService>
    > as jest.Mocked<FindGameOptionsTypeOrmService>;

    gameOptionsPersistenceTypeOrmAdapter =
      new GameOptionsPersistenceTypeOrmAdapter(
        createGameOptionsTypeOrmServiceMock,
        findGameOptionsTypeOrmServiceMock,
      );
  });

  describe('.create', () => {
    let gameOptionsCreateQueryFixture: GameOptionsCreateQuery;

    beforeAll(() => {
      gameOptionsCreateQueryFixture = GameOptionsCreateQueryFixtures.any;
    });

    describe('when called', () => {
      let gameOptionsFixture: GameOptions;

      let result: unknown;

      beforeAll(async () => {
        gameOptionsFixture = GameOptionsFixtures.any;

        createGameOptionsTypeOrmServiceMock.insertOne.mockResolvedValueOnce(
          gameOptionsFixture,
        );

        result = await gameOptionsPersistenceTypeOrmAdapter.create(
          gameOptionsCreateQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createGameOptionsTypeOrmService.insertOne()', () => {
        expect(
          createGameOptionsTypeOrmServiceMock.insertOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          createGameOptionsTypeOrmServiceMock.insertOne,
        ).toHaveBeenCalledWith(gameOptionsCreateQueryFixture);
      });

      it('should return GameOptions', () => {
        expect(result).toBe(gameOptionsFixture);
      });
    });
  });

  describe('.findOne', () => {
    let gameOptionsFindQueryFixture: GameOptionsFindQuery;

    beforeAll(() => {
      gameOptionsFindQueryFixture = GameOptionsFindQueryFixtures.any;
    });

    describe('when called', () => {
      let gameOptionsFixture: GameOptions;

      let result: unknown;

      beforeAll(async () => {
        gameOptionsFixture = GameOptionsFixtures.any;

        findGameOptionsTypeOrmServiceMock.findOne.mockResolvedValueOnce(
          gameOptionsFixture,
        );

        result = await gameOptionsPersistenceTypeOrmAdapter.findOne(
          gameOptionsFindQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findGameOptionsTypeOrmService.insertOne()', () => {
        expect(findGameOptionsTypeOrmServiceMock.findOne).toHaveBeenCalledTimes(
          1,
        );
        expect(findGameOptionsTypeOrmServiceMock.findOne).toHaveBeenCalledWith(
          gameOptionsFindQueryFixture,
        );
      });

      it('should return GameOptions', () => {
        expect(result).toBe(gameOptionsFixture);
      });
    });
  });
});
