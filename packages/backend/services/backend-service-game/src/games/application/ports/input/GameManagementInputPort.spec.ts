import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';

import { GameCreateQueryV1Fixtures } from '../../../../cards/application/fixtures/GameCreateQueryV1Fixtures';
import { UuidContext } from '../../../../foundation/common/application/models/UuidContext';
import { UuidProviderOutputPort } from '../../../../foundation/common/application/ports/output/UuidProviderOutputPort';
import { ActiveGameFixtures } from '../../../domain/fixtures/ActiveGameFixtures';
import { GameCreateQueryFixtures } from '../../../domain/fixtures/GameCreateQueryFixtures';
import { NonStartedGameFixtures } from '../../../domain/fixtures/NonStartedGameFixtures';
import { Game } from '../../../domain/models/Game';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameFindQuery } from '../../../domain/query/GameFindQuery';
import { ActiveGameV1Fixtures } from '../../fixtures/ActiveGameV1Fixtures';
import { NonStartedGameV1Fixtures } from '../../fixtures/NonStartedGameV1Fixtures';
import { GamePersistenceOutputPort } from '../output/GamePersistenceOutputPort';
import { GameManagementInputPort } from './GameManagementInputPort';

describe(GameManagementInputPort.name, () => {
  let gameCreateQueryFromGameCreateQueryV1BuilderMock: jest.Mocked<
    Builder<GameCreateQuery, [apiModels.GameCreateQueryV1, UuidContext]>
  >;
  let gameV1FromGameBuilderMock: jest.Mocked<Builder<apiModels.GameV1, [Game]>>;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;
  let uuidProviderOutputPortMock: jest.Mocked<UuidProviderOutputPort>;

  let gameManagementInputPort: GameManagementInputPort;

  beforeAll(() => {
    gameCreateQueryFromGameCreateQueryV1BuilderMock = {
      build: jest.fn(),
    };
    gameV1FromGameBuilderMock = {
      build: jest.fn(),
    };
    gamePersistenceOutputPortMock = {
      create: jest.fn(),
      findOne: jest.fn(),
    };
    uuidProviderOutputPortMock = {
      generateV4: jest.fn(),
    };

    gameManagementInputPort = new GameManagementInputPort(
      gameCreateQueryFromGameCreateQueryV1BuilderMock,
      gameV1FromGameBuilderMock,
      gamePersistenceOutputPortMock,
      uuidProviderOutputPortMock,
    );
  });

  describe('.create', () => {
    let gameCreateQueryV1Fixture: apiModels.GameCreateQueryV1;

    beforeAll(() => {
      gameCreateQueryV1Fixture = GameCreateQueryV1Fixtures.any;
    });

    describe('when called', () => {
      let uuidFixture: string;
      let gameCreateQueryFixture: GameCreateQuery;
      let gameFixture: Game;
      let gameV1Fixture: apiModels.GameV1;

      let result: unknown;

      beforeAll(async () => {
        uuidFixture = 'uuid-fixture';
        gameCreateQueryFixture = GameCreateQueryFixtures.any;
        gameFixture = ActiveGameFixtures.any;
        gameV1Fixture = ActiveGameV1Fixtures.any;

        uuidProviderOutputPortMock.generateV4.mockReturnValue(uuidFixture);
        gameCreateQueryFromGameCreateQueryV1BuilderMock.build.mockReturnValueOnce(
          gameCreateQueryFixture,
        );
        gameV1FromGameBuilderMock.build.mockReturnValueOnce(gameV1Fixture);
        gamePersistenceOutputPortMock.create.mockResolvedValueOnce(gameFixture);

        result = await gameManagementInputPort.create(gameCreateQueryV1Fixture);
      });

      afterAll(() => {
        jest.clearAllMocks();

        uuidProviderOutputPortMock.generateV4.mockReset();
      });

      it('should call uuidProviderOutputPort.generateV4()', () => {
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledTimes(1);
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledWith();
      });

      it('should call gameCreateQueryFromGameCreateQueryV1Builder.build()', () => {
        const expectedUuidContext: UuidContext = {
          uuid: uuidFixture,
        };

        expect(
          gameCreateQueryFromGameCreateQueryV1BuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCreateQueryFromGameCreateQueryV1BuilderMock.build,
        ).toHaveBeenCalledWith(gameCreateQueryV1Fixture, expectedUuidContext);
      });

      it('should call gamePersistenceOutputPort.create()', () => {
        expect(gamePersistenceOutputPortMock.create).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.create).toHaveBeenCalledWith(
          gameCreateQueryFixture,
        );
      });

      it('should call gameV1FromGameBuilder.build()', () => {
        expect(gameV1FromGameBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(gameV1FromGameBuilderMock.build).toHaveBeenCalledWith(
          gameFixture,
        );
      });

      it('should return a GameV1', () => {
        expect(result).toBe(gameV1Fixture);
      });
    });
  });

  describe('.findOne', () => {
    let gameIdFixture: string;

    beforeAll(() => {
      gameIdFixture = 'game-id-fixture';
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns a Game', () => {
      let gameFixture: Game;
      let gameV1Fixture: apiModels.GameV1;

      let result: unknown;

      beforeAll(async () => {
        gameFixture = NonStartedGameFixtures.any;
        gameV1Fixture = NonStartedGameV1Fixtures.any;

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameFixture,
        );

        gameV1FromGameBuilderMock.build.mockReturnValueOnce(gameV1Fixture);

        result = await gameManagementInputPort.findOne(gameIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expectedGameFindQuery: GameFindQuery = {
          id: gameIdFixture,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameFindQuery,
        );
      });

      it('should call gameV1FromGameBuilder.build()', () => {
        expect(gameV1FromGameBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(gameV1FromGameBuilderMock.build).toHaveBeenCalledWith(
          gameFixture,
        );
      });

      it('should return a gameV1', () => {
        expect(result).toBe(gameV1Fixture);
      });
    });
  });
});
