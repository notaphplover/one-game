import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@one-game-js/api-models';
import { AppError, AppErrorKind, Builder } from '@one-game-js/backend-common';

import { UuidProviderOutputPort } from '../../../../foundation/common/application/ports/output/UuidProviderOutputPort';
import { GameSlotCreateQueryFixtures } from '../../../domain/fixtures/GameSlotCreateQueryFixtures';
import { NonStartedGameFixtures } from '../../../domain/fixtures/NonStartedGameFixtures';
import { NonStartedGameSlotFixtures } from '../../../domain/fixtures/NonStartedGameSlotFixtures';
import { ActiveGameSlot } from '../../../domain/models/ActiveGameSlot';
import { Game } from '../../../domain/models/Game';
import { NonStartedGameSlot } from '../../../domain/models/NonStartedGameSlot';
import { GameSlotCreateQuery } from '../../../domain/query/GameSlotCreateQuery';
import { GameCanHoldMoreGameSlotsSpec } from '../../../domain/specs/GameCanHoldMoreGameSlotsSpec';
import { NonStartedGameSlotV1Fixtures } from '../../fixtures/NonStartedGameSlotV1Fixtures';
import { GameSlotCreateQueryContext } from '../../models/GameSlotCreateQueryContext';
import { GameSlotPersistenceOutputPort } from '../output/GameSlotPersistenceOutputPort';
import { GameSlotManagementInputPort } from './GameSlotManagementInputPort';

describe(GameSlotManagementInputPort.name, () => {
  let gameCanHoldMoreGameSlotsSpecMock: jest.Mocked<GameCanHoldMoreGameSlotsSpec>;
  let gameSlotCreateQueryFromGameSlotCreateQueryV1BuilderMock: jest.Mocked<
    Builder<
      GameSlotCreateQuery,
      [apiModels.GameIdSlotCreateQueryV1, GameSlotCreateQueryContext]
    >
  >;
  let gameSlotV1FromGameSlotBuilderMock: jest.Mocked<
    Builder<apiModels.GameSlotV1, [ActiveGameSlot | NonStartedGameSlot]>
  >;
  let gameSlotPersistenceOutputPortMock: jest.Mocked<GameSlotPersistenceOutputPort>;
  let uuidProviderOutputPortMock: jest.Mocked<UuidProviderOutputPort>;

  let gameSlotManagementInputPort: GameSlotManagementInputPort;

  beforeAll(() => {
    gameCanHoldMoreGameSlotsSpecMock = {
      isSatisfiedBy: jest.fn(),
    };
    gameSlotCreateQueryFromGameSlotCreateQueryV1BuilderMock = {
      build: jest.fn(),
    };
    gameSlotV1FromGameSlotBuilderMock = {
      build: jest.fn(),
    };
    gameSlotPersistenceOutputPortMock = {
      create: jest.fn(),
    };
    uuidProviderOutputPortMock = {
      generateV4: jest.fn(),
    };

    gameSlotManagementInputPort = new GameSlotManagementInputPort(
      gameCanHoldMoreGameSlotsSpecMock,
      gameSlotCreateQueryFromGameSlotCreateQueryV1BuilderMock,
      gameSlotV1FromGameSlotBuilderMock,
      gameSlotPersistenceOutputPortMock,
      uuidProviderOutputPortMock,
    );
  });

  describe('.create', () => {
    let gameFixture: Game;
    let gameSlotCreateQueryV1Fixture: apiModels.GameIdSlotCreateQueryV1;

    beforeAll(() => {
      gameFixture = NonStartedGameFixtures.any;
      gameSlotCreateQueryV1Fixture = GameSlotCreateQueryFixtures.any;
    });

    describe('when called, and gameCanHoldMoreGameSlotsSpec.isSatisfiedBy() returns true', () => {
      let gameSlotCreateQueryFixture: GameSlotCreateQuery;
      let gameSlotFixture: ActiveGameSlot | NonStartedGameSlot;
      let gameSlotV1Fixture: apiModels.GameSlotV1;
      let uuidFixture: string;

      let result: unknown;

      beforeAll(async () => {
        gameSlotCreateQueryFixture = GameSlotCreateQueryFixtures.any;
        gameSlotFixture = NonStartedGameSlotFixtures.any;
        gameSlotV1Fixture = NonStartedGameSlotV1Fixtures.any;
        uuidFixture = 'uuid-fixture';

        gameCanHoldMoreGameSlotsSpecMock.isSatisfiedBy.mockReturnValueOnce(
          true,
        );
        gameSlotCreateQueryFromGameSlotCreateQueryV1BuilderMock.build.mockReturnValueOnce(
          gameSlotCreateQueryFixture,
        );
        gameSlotV1FromGameSlotBuilderMock.build.mockReturnValueOnce(
          gameSlotV1Fixture,
        );
        gameSlotPersistenceOutputPortMock.create.mockResolvedValueOnce(
          gameSlotFixture,
        );
        uuidProviderOutputPortMock.generateV4.mockReturnValueOnce(uuidFixture);

        result = await gameSlotManagementInputPort.create(
          gameSlotCreateQueryV1Fixture,
          gameFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameCanHoldMoreGameSlotsSpec.isSatisfiedBy()', () => {
        expect(
          gameCanHoldMoreGameSlotsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCanHoldMoreGameSlotsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(gameFixture);
      });

      it('should call uuidProviderOutputPort.generateV4()', () => {
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledTimes(1);
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledWith();
      });

      it('should call gameSlotCreateQueryFromGameSlotCreateQueryV1Builder.build()', () => {
        const expectedContext: GameSlotCreateQueryContext = {
          game: gameFixture,
          uuid: uuidFixture,
        };

        expect(
          gameSlotCreateQueryFromGameSlotCreateQueryV1BuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameSlotCreateQueryFromGameSlotCreateQueryV1BuilderMock.build,
        ).toHaveBeenCalledWith(gameSlotCreateQueryFixture, expectedContext);
      });

      it('should call gameSlotPersistenceOutputPort.create()', () => {
        expect(gameSlotPersistenceOutputPortMock.create).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSlotPersistenceOutputPortMock.create).toHaveBeenCalledWith(
          gameSlotCreateQueryFixture,
        );
      });

      it('should call gameSlotV1FromGameSlotBuilder.build()', () => {
        expect(gameSlotV1FromGameSlotBuilderMock.build).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSlotV1FromGameSlotBuilderMock.build).toHaveBeenCalledWith(
          gameSlotFixture,
        );
      });

      it('should return a GameSlotV1', () => {
        expect(result).toBe(gameSlotV1Fixture);
      });
    });

    describe('when called, and gameCanHoldMoreGameSlotsSpec.isSatisfiedBy() returns false', () => {
      let result: unknown;

      beforeAll(async () => {
        gameCanHoldMoreGameSlotsSpecMock.isSatisfiedBy.mockReturnValueOnce(
          false,
        );

        try {
          await gameSlotManagementInputPort.create(
            gameSlotCreateQueryV1Fixture,
            gameFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameCanHoldMoreGameSlotsSpec.isSatisfiedBy()', () => {
        expect(
          gameCanHoldMoreGameSlotsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCanHoldMoreGameSlotsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(gameFixture);
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message: expect.stringContaining(
            'cannot hold more game slots',
          ) as unknown as string,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });
});
