import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { UuidProviderOutputPort } from '@cornie-js/backend-app-uuid';
import {
  AppError,
  AppErrorKind,
  Builder,
  Left,
} from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  Game,
  GameCreateQuery,
  GameSpec,
  IsValidGameCreateQuerySpec,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameFixtures,
  GameCreateQueryFixtures,
  GameSpecFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { TransactionProvisionOutputPort } from '../../../foundation/db/application/ports/output/TransactionProvisionOutputPort';
import { ActiveGameV1Fixtures } from '../fixtures/ActiveGameV1Fixtures';
import { GameCreateQueryV1Fixtures } from '../fixtures/GameCreateQueryV1Fixtures';
import { GameCreateQueryContext } from '../models/GameCreateQueryContext';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameSpecPersistenceOutputPort } from '../ports/output/GameSpecPersistenceOutputPort';
import { CreateGameUseCaseHandler } from './CreateGameUseCaseHandler';

describe(CreateGameUseCaseHandler.name, () => {
  let gameCreateQueryFromGameCreateQueryV1BuilderMock: jest.Mocked<
    Builder<GameCreateQuery, [apiModels.GameCreateQueryV1, UuidContext]>
  >;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;
  let gameSpecPersistenceOutputPortMock: jest.Mocked<GameSpecPersistenceOutputPort>;
  let gameV1FromGameBuilderMock: jest.Mocked<Builder<apiModels.GameV1, [Game]>>;
  let isValidGameCreateQuerySpecMock: jest.Mocked<IsValidGameCreateQuerySpec>;
  let transactionProvisionOutputPortMock: jest.Mocked<TransactionProvisionOutputPort>;
  let uuidProviderOutputPortMock: jest.Mocked<UuidProviderOutputPort>;

  let createGameUseCaseHandler: CreateGameUseCaseHandler;

  beforeAll(() => {
    gameCreateQueryFromGameCreateQueryV1BuilderMock = {
      build: jest.fn(),
    };
    gameV1FromGameBuilderMock = {
      build: jest.fn(),
    };
    gamePersistenceOutputPortMock = {
      create: jest.fn(),
    } as Partial<
      jest.Mocked<GamePersistenceOutputPort>
    > as jest.Mocked<GamePersistenceOutputPort>;
    gameSpecPersistenceOutputPortMock = {
      create: jest.fn(),
    } as Partial<
      jest.Mocked<GameSpecPersistenceOutputPort>
    > as jest.Mocked<GameSpecPersistenceOutputPort>;
    isValidGameCreateQuerySpecMock = {
      isSatisfiedOrReport: jest.fn(),
    };
    transactionProvisionOutputPortMock = {
      provide: jest.fn(),
    };
    uuidProviderOutputPortMock = {
      generateV4: jest.fn(),
    };

    createGameUseCaseHandler = new CreateGameUseCaseHandler(
      gameCreateQueryFromGameCreateQueryV1BuilderMock,
      gamePersistenceOutputPortMock,
      gameSpecPersistenceOutputPortMock,
      gameV1FromGameBuilderMock,
      isValidGameCreateQuerySpecMock,
      transactionProvisionOutputPortMock,
      uuidProviderOutputPortMock,
    );
  });

  describe('.handle', () => {
    let gameCreateQueryV1Fixture: apiModels.GameCreateQueryV1;

    beforeAll(() => {
      gameCreateQueryV1Fixture = GameCreateQueryV1Fixtures.any;
    });

    describe('when called, and isValidGameCreateQuerySpec.isSatisfiedOrReport() returns Right', () => {
      let uuidFixture: string;
      let gameCreateQueryFixture: GameCreateQuery;
      let gameFixture: Game;
      let gameSpecFixture: GameSpec;
      let gameV1Fixture: apiModels.GameV1;
      let transactionWrapperMock: jest.Mocked<TransactionWrapper>;

      let result: unknown;

      beforeAll(async () => {
        uuidFixture = 'uuid-fixture';
        gameCreateQueryFixture = GameCreateQueryFixtures.any;
        gameFixture = ActiveGameFixtures.any;
        gameSpecFixture = GameSpecFixtures.any;
        gameV1Fixture = ActiveGameV1Fixtures.any;
        transactionWrapperMock = {
          rollback: jest.fn(),
          tryCommit: jest
            .fn()
            .mockImplementationOnce(async (): Promise<void> => undefined),
        } as Partial<
          jest.Mocked<TransactionWrapper>
        > as jest.Mocked<TransactionWrapper>;

        uuidProviderOutputPortMock.generateV4.mockReturnValue(uuidFixture);
        gameCreateQueryFromGameCreateQueryV1BuilderMock.build.mockReturnValueOnce(
          gameCreateQueryFixture,
        );
        gamePersistenceOutputPortMock.create.mockResolvedValueOnce(gameFixture);
        gameSpecPersistenceOutputPortMock.create.mockResolvedValueOnce(
          gameSpecFixture,
        );
        gameV1FromGameBuilderMock.build.mockReturnValueOnce(gameV1Fixture);
        isValidGameCreateQuerySpecMock.isSatisfiedOrReport.mockReturnValueOnce({
          isRight: true,
          value: undefined,
        });
        transactionProvisionOutputPortMock.provide.mockResolvedValueOnce(
          transactionWrapperMock,
        );

        result = await createGameUseCaseHandler.handle(
          gameCreateQueryV1Fixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();

        uuidProviderOutputPortMock.generateV4.mockReset();
      });

      it('should call uuidProviderOutputPort.generateV4()', () => {
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledTimes(3);
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledWith();
      });

      it('should call gameCreateQueryFromGameCreateQueryV1Builder.build()', () => {
        const expectedUuidContext: GameCreateQueryContext = {
          gameOptionsId: uuidFixture,
          gameSpecId: uuidFixture,
          uuid: uuidFixture,
        };

        expect(
          gameCreateQueryFromGameCreateQueryV1BuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCreateQueryFromGameCreateQueryV1BuilderMock.build,
        ).toHaveBeenCalledWith(gameCreateQueryV1Fixture, expectedUuidContext);
      });

      it('should call transactionProvisionOutputPort.provide()', () => {
        expect(
          transactionProvisionOutputPortMock.provide,
        ).toHaveBeenCalledTimes(1);
        expect(
          transactionProvisionOutputPortMock.provide,
        ).toHaveBeenCalledWith();
      });

      it('should call gamePersistenceOutputPort.create()', () => {
        expect(gamePersistenceOutputPortMock.create).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.create).toHaveBeenCalledWith(
          gameCreateQueryFixture,
          transactionWrapperMock,
        );
      });

      it('should call gameSpecPersistenceOutputPort.create()', () => {
        expect(gameSpecPersistenceOutputPortMock.create).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecPersistenceOutputPortMock.create).toHaveBeenCalledWith(
          gameCreateQueryFixture.spec,
          transactionWrapperMock,
        );
      });

      it('should call transactionWrapper.tryCommit()', () => {
        expect(transactionWrapperMock.tryCommit).toHaveBeenCalledTimes(1);
        expect(transactionWrapperMock.tryCommit).toHaveBeenCalledWith();
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

    describe('when called, and isValidGameCreateQuerySpec.isSatisfiedOrReport() returns Right, and transactionWrapper.tryCommit throws an Error', () => {
      let errorFixture: unknown;
      let uuidFixture: string;
      let gameCreateQueryFixture: GameCreateQuery;
      let gameFixture: Game;
      let gameSpecFixture: GameSpec;
      let transactionWrapperMock: jest.Mocked<TransactionWrapper>;

      let result: unknown;

      beforeAll(async () => {
        errorFixture = Symbol();
        uuidFixture = 'uuid-fixture';
        gameCreateQueryFixture = GameCreateQueryFixtures.any;
        gameFixture = ActiveGameFixtures.any;
        gameSpecFixture = GameSpecFixtures.any;

        transactionWrapperMock = {
          rollback: jest
            .fn()
            .mockImplementationOnce(async (): Promise<void> => undefined),
          tryCommit: jest.fn().mockImplementationOnce(async () => {
            throw errorFixture;
          }),
        } as Partial<
          jest.Mocked<TransactionWrapper>
        > as jest.Mocked<TransactionWrapper>;

        uuidProviderOutputPortMock.generateV4.mockReturnValue(uuidFixture);
        gameCreateQueryFromGameCreateQueryV1BuilderMock.build.mockReturnValueOnce(
          gameCreateQueryFixture,
        );
        gamePersistenceOutputPortMock.create.mockResolvedValueOnce(gameFixture);
        gameSpecPersistenceOutputPortMock.create.mockResolvedValueOnce(
          gameSpecFixture,
        );
        isValidGameCreateQuerySpecMock.isSatisfiedOrReport.mockReturnValueOnce({
          isRight: true,
          value: undefined,
        });
        transactionProvisionOutputPortMock.provide.mockResolvedValueOnce(
          transactionWrapperMock,
        );
        transactionWrapperMock.tryCommit.mockRejectedValueOnce(errorFixture);

        try {
          await createGameUseCaseHandler.handle(gameCreateQueryV1Fixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();

        uuidProviderOutputPortMock.generateV4.mockReset();
      });

      it('should call transactionWrapper.rollback()', () => {
        expect(transactionWrapperMock.rollback).toHaveBeenCalledTimes(1);
        expect(transactionWrapperMock.rollback).toHaveBeenCalledWith();
      });

      it('should not call gameV1FromGameBuilder.build()', () => {
        expect(gameV1FromGameBuilderMock.build).not.toHaveBeenCalled();
      });

      it('should throw an error', () => {
        expect(result).toBe(errorFixture);
      });
    });

    describe('when called, and isValidGameCreateQuerySpec.isSatisfiedOrReport() returns Left', () => {
      let uuidFixture: string;
      let gameCreateQueryFixture: GameCreateQuery;
      let reportFixture: Left<string[]>;

      let result: unknown;

      beforeAll(async () => {
        uuidFixture = 'uuid-fixture';
        gameCreateQueryFixture = GameCreateQueryFixtures.any;
        reportFixture = {
          isRight: false,
          value: ['Error fixture'],
        };

        uuidProviderOutputPortMock.generateV4.mockReturnValue(uuidFixture);
        gameCreateQueryFromGameCreateQueryV1BuilderMock.build.mockReturnValueOnce(
          gameCreateQueryFixture,
        );
        isValidGameCreateQuerySpecMock.isSatisfiedOrReport.mockReturnValueOnce(
          reportFixture,
        );

        try {
          await createGameUseCaseHandler.handle(gameCreateQueryV1Fixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();

        uuidProviderOutputPortMock.generateV4.mockReset();
      });

      it('should call uuidProviderOutputPort.generateV4()', () => {
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledTimes(3);
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledWith();
      });

      it('should call gameCreateQueryFromGameCreateQueryV1Builder.build()', () => {
        const expectedUuidContext: GameCreateQueryContext = {
          gameOptionsId: uuidFixture,
          gameSpecId: uuidFixture,
          uuid: uuidFixture,
        };

        expect(
          gameCreateQueryFromGameCreateQueryV1BuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCreateQueryFromGameCreateQueryV1BuilderMock.build,
        ).toHaveBeenCalledWith(gameCreateQueryV1Fixture, expectedUuidContext);
      });

      it('should throw an AppError', () => {
        const expectedErrorProperies: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message: 'Unable to create game. Error fixture.',
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperies),
        );
      });
    });
  });
});
