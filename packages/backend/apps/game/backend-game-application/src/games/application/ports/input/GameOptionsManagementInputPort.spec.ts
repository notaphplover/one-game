import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import {
  GameOptions,
  GameOptionsFindQuery,
} from '@cornie-js/backend-game-domain/games';
import {
  GameOptionsFindQueryFixtures,
  GameOptionsFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { GameOptionsV1Fixtures } from '../../fixtures/GameOptionsV1Fixtures';
import { GameOptionsPersistenceOutputPort } from '../../ports/output/GameOptionsPersistenceOutputPort';
import { GameOptionsManagementInputPort } from './GameOptionsManagementInputPort';

describe(GameOptionsManagementInputPort.name, () => {
  let gameOptionsPersistenceOutputPortMock: jest.Mocked<GameOptionsPersistenceOutputPort>;
  let gameOptionsV1FromGameOptionsBuilderMock: jest.Mocked<
    Builder<apiModels.GameOptionsV1, [GameOptions]>
  >;

  let gameOptionsManagementInputPort: GameOptionsManagementInputPort;

  beforeAll(() => {
    gameOptionsPersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GameOptionsPersistenceOutputPort>
    > as jest.Mocked<GameOptionsPersistenceOutputPort>;

    gameOptionsV1FromGameOptionsBuilderMock = {
      build: jest.fn(),
    };

    gameOptionsManagementInputPort = new GameOptionsManagementInputPort(
      gameOptionsPersistenceOutputPortMock,
      gameOptionsV1FromGameOptionsBuilderMock,
    );
  });

  describe('.findOne', () => {
    let gameOptionsFindQueryFixture: GameOptionsFindQuery;

    beforeAll(() => {
      gameOptionsFindQueryFixture = GameOptionsFindQueryFixtures.any;
    });

    describe('when called, and gameOptionsPersistenceOutputPort.findOne returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        gameOptionsPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          undefined,
        );

        result = await gameOptionsManagementInputPort.findOne(
          gameOptionsFindQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameOptionsPersistenceOutputPort.findOne', () => {
        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledWith(gameOptionsFindQueryFixture);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and gameOptionsPersistenceOutputPort.findOne returns GameOptions', () => {
      let gameOptionsFixture: GameOptions;
      let gameOptionsV1Fixture: apiModels.GameOptionsV1;

      let result: unknown;

      beforeAll(async () => {
        gameOptionsFixture = GameOptionsFixtures.any;
        gameOptionsV1Fixture = GameOptionsV1Fixtures.any;

        gameOptionsPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameOptionsFixture,
        );

        gameOptionsV1FromGameOptionsBuilderMock.build.mockReturnValueOnce(
          gameOptionsV1Fixture,
        );

        result = await gameOptionsManagementInputPort.findOne(
          gameOptionsFindQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameOptionsPersistenceOutputPort.findOne', () => {
        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledWith(gameOptionsFindQueryFixture);
      });

      it('should call gameOptionsV1FromGameOptionsBuilder.build', () => {
        expect(
          gameOptionsV1FromGameOptionsBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsV1FromGameOptionsBuilderMock.build,
        ).toHaveBeenCalledWith(gameOptionsFixture);
      });

      it('should return GameOptionsV1', () => {
        expect(result).toStrictEqual(gameOptionsV1Fixture);
      });
    });
  });
});
