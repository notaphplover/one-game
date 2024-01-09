import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import {
  GameSpec,
  GameSpecFindQuery,
} from '@cornie-js/backend-game-domain/games';
import {
  GameSpecFindQueryFixtures,
  GameSpecFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { GameSpecV1Fixtures } from '../../fixtures/GameSpecV1Fixtures';
import { GameSpecPersistenceOutputPort } from '../../ports/output/GameSpecPersistenceOutputPort';
import { GameSpecManagementInputPort } from './GameSpecManagementInputPort';

describe(GameSpecManagementInputPort.name, () => {
  let gameSpecPersistenceOutputPortMock: jest.Mocked<GameSpecPersistenceOutputPort>;
  let gameSpecV1FromGameSpecBuilderMock: jest.Mocked<
    Builder<apiModels.GameSpecV1, [GameSpec]>
  >;

  let gameSpecManagementInputPort: GameSpecManagementInputPort;

  beforeAll(() => {
    gameSpecPersistenceOutputPortMock = {
      find: jest.fn(),
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GameSpecPersistenceOutputPort>
    > as jest.Mocked<GameSpecPersistenceOutputPort>;
    gameSpecV1FromGameSpecBuilderMock = {
      build: jest.fn(),
    };

    gameSpecManagementInputPort = new GameSpecManagementInputPort(
      gameSpecPersistenceOutputPortMock,
      gameSpecV1FromGameSpecBuilderMock,
    );
  });

  describe('.find', () => {
    let gameSpecFindQueryFixture: GameSpecFindQuery;

    beforeAll(() => {
      gameSpecFindQueryFixture = GameSpecFindQueryFixtures.any;
    });

    describe('when called, and gameSpecPersistenceOutputPort.find() resolves an array of one game spec', () => {
      let gameSpecFixture: GameSpec;
      let gameSpecV1Fixture: apiModels.GameSpecV1;

      let result: unknown;

      beforeAll(async () => {
        gameSpecFixture = GameSpecFixtures.any;
        gameSpecV1Fixture = GameSpecV1Fixtures.any;

        gameSpecPersistenceOutputPortMock.find.mockResolvedValueOnce([
          gameSpecFixture,
        ]);

        gameSpecV1FromGameSpecBuilderMock.build.mockReturnValueOnce(
          gameSpecV1Fixture,
        );

        result = await gameSpecManagementInputPort.find(
          gameSpecFindQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameSpecPersistenceOutputPort.find()', () => {
        expect(gameSpecPersistenceOutputPortMock.find).toHaveBeenCalledTimes(1);
        expect(gameSpecPersistenceOutputPortMock.find).toHaveBeenCalledWith(
          gameSpecFindQueryFixture,
        );
      });

      it('should call gameSpecV1FromGameSpecBuilder.build()', () => {
        expect(gameSpecV1FromGameSpecBuilderMock.build).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecV1FromGameSpecBuilderMock.build).toHaveBeenCalledWith(
          gameSpecFixture,
        );
      });

      it('should return GameSpecV1[]', () => {
        expect(result).toStrictEqual([gameSpecV1Fixture]);
      });
    });
  });

  describe('.findOne', () => {
    let gameSpecFindQueryFixture: GameSpecFindQuery;

    beforeAll(() => {
      gameSpecFindQueryFixture = GameSpecFindQueryFixtures.any;
    });

    describe('when called, and gameSpecPersistenceOutputPort.findOne() resolves undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          undefined,
        );

        result = await gameSpecManagementInputPort.findOne(
          gameSpecFindQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameSpecPersistenceOutputPort.findOne()', () => {
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          gameSpecFindQueryFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and gameSpecPersistenceOutputPort.findOne() resolves a game', () => {
      let gameSpecFixture: GameSpec;
      let gameSpecV1Fixture: apiModels.GameSpecV1;

      let result: unknown;

      beforeAll(async () => {
        gameSpecFixture = GameSpecFixtures.any;
        gameSpecV1Fixture = GameSpecV1Fixtures.any;

        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
        );

        gameSpecV1FromGameSpecBuilderMock.build.mockReturnValueOnce(
          gameSpecV1Fixture,
        );

        result = await gameSpecManagementInputPort.findOne(
          gameSpecFindQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameSpecPersistenceOutputPort.findOne()', () => {
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          gameSpecFindQueryFixture,
        );
      });

      it('should call gameSpecV1FromGameSpecBuilder.build()', () => {
        expect(gameSpecV1FromGameSpecBuilderMock.build).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecV1FromGameSpecBuilderMock.build).toHaveBeenCalledWith(
          gameSpecFixture,
        );
      });

      it('should return GameSpecV1', () => {
        expect(result).toBe(gameSpecV1Fixture);
      });
    });
  });
});
