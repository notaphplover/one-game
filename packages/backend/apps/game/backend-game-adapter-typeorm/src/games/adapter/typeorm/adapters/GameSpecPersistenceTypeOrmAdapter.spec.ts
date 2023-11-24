import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  GameSpec,
  GameSpecCreateQuery,
} from '@cornie-js/backend-game-domain/games';
import {
  GameSpecCreateQueryFixtures,
  GameSpecFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { CreateGameSpecTypeOrmService } from '../services/CreateGameSpecTypeOrmService';
import { GameSpecPersistenceTypeOrmAdapter } from './GameSpecPersistenceTypeOrmAdapter';

describe(GameSpecPersistenceTypeOrmAdapter.name, () => {
  let createGameSpecTypeOrmServiceMock: jest.Mocked<CreateGameSpecTypeOrmService>;

  let gameSpecPersistenceTypeOrmAdapter: GameSpecPersistenceTypeOrmAdapter;

  beforeAll(() => {
    createGameSpecTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateGameSpecTypeOrmService>
    > as jest.Mocked<CreateGameSpecTypeOrmService>;

    gameSpecPersistenceTypeOrmAdapter = new GameSpecPersistenceTypeOrmAdapter(
      createGameSpecTypeOrmServiceMock,
    );
  });

  describe('.create', () => {
    let gameSpecCreateQueryFixture: GameSpecCreateQuery;

    beforeAll(() => {
      gameSpecCreateQueryFixture = GameSpecCreateQueryFixtures.any;
    });

    describe('when called', () => {
      let gameSpecFixture: GameSpec;

      let result: unknown;

      beforeAll(async () => {
        gameSpecFixture = GameSpecFixtures.any;

        createGameSpecTypeOrmServiceMock.insertOne.mockResolvedValueOnce(
          gameSpecFixture,
        );

        result = await gameSpecPersistenceTypeOrmAdapter.create(
          gameSpecCreateQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createGameSpecTypeOrmService.insertOne()', () => {
        expect(
          createGameSpecTypeOrmServiceMock.insertOne,
        ).toHaveBeenCalledTimes(1);
        expect(createGameSpecTypeOrmServiceMock.insertOne).toHaveBeenCalledWith(
          gameSpecCreateQueryFixture,
        );
      });

      it('should return GameSpec', () => {
        expect(result).toBe(gameSpecFixture);
      });
    });
  });
});
