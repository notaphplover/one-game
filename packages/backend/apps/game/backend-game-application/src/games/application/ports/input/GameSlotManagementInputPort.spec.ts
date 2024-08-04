/*
 * Ugly workaround until https://github.com/jestjs/jest/issues/14874 is provided in jest@30
 */

const disposeSymbol: unique symbol = Symbol('Symbol.dispose');
const asyncDisposeSymbol: unique symbol = Symbol('Symbol.asyncDispose');

(Symbol as Writable<Partial<SymbolConstructor>>).asyncDispose ??=
  asyncDisposeSymbol as unknown as SymbolConstructor['asyncDispose'];
(Symbol as Writable<Partial<SymbolConstructor>>).dispose ??=
  disposeSymbol as unknown as SymbolConstructor['dispose'];

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { UuidProviderOutputPort } from '@cornie-js/backend-app-uuid';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
  Spec,
  Writable,
} from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { Card } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  ActiveGameSlot,
  Game,
  GameSlotCreateQuery,
  GameSpec,
  GameSpecFindQuery,
  NonStartedGame,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameFixtures,
  GameSlotCreateQueryFixtures,
  GameSpecFixtures,
  NonStartedGameFixtures,
  NonStartedGameSlotFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { CardV1Fixtures } from '../../../../cards/application/fixtures/CardV1Fixtures';
import { TransactionProvisionOutputPort } from '../../../../foundation/db/application/ports/output/TransactionProvisionOutputPort';
import { UserV1Fixtures } from '../../../../users/application/fixtures/models/UserV1Fixtures';
import { NonStartedGameSlotV1Fixtures } from '../../fixtures/NonStartedGameSlotV1Fixtures';
import { GameSlotCreateQueryContext } from '../../models/GameSlotCreateQueryContext';
import { NonStartedGameFilledEvent } from '../../models/NonStartedGameFilledEvent';
import { GameSlotPersistenceOutputPort } from '../../ports/output/GameSlotPersistenceOutputPort';
import { GameSpecPersistenceOutputPort } from '../../ports/output/GameSpecPersistenceOutputPort';
import { GameSlotManagementInputPort } from './GameSlotManagementInputPort';

describe(GameSlotManagementInputPort.name, () => {
  let cardV1FromCardBuilderMock: jest.Mocked<Builder<apiModels.CardV1, [Card]>>;
  let gameCanHoldMoreGameSlotsSpecMock: jest.Mocked<Spec<[Game]>>;
  let gameCanHoldOnlyOneMoreGameSlotSpecMock: jest.Mocked<
    Spec<[Game, GameSpec]>
  >;
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
  let gameSpecPersistenceOutputPortMock: jest.Mocked<GameSpecPersistenceOutputPort>;
  let nonStartedGameFilledEventHandlerMock: jest.Mocked<
    Handler<[NonStartedGameFilledEvent], void>
  >;
  let transactionProvisionOutputPortMock: jest.Mocked<TransactionProvisionOutputPort>;
  let uuidProviderOutputPortMock: jest.Mocked<UuidProviderOutputPort>;

  let gameSlotManagementInputPort: GameSlotManagementInputPort;

  beforeAll(() => {
    cardV1FromCardBuilderMock = {
      build: jest.fn(),
    };
    gameCanHoldMoreGameSlotsSpecMock = {
      isSatisfiedBy: jest.fn(),
    };
    gameCanHoldOnlyOneMoreGameSlotSpecMock = {
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
      update: jest.fn(),
    };
    gameSpecPersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GameSpecPersistenceOutputPort>
    > as jest.Mocked<GameSpecPersistenceOutputPort>;
    nonStartedGameFilledEventHandlerMock = {
      handle: jest.fn(),
    };
    transactionProvisionOutputPortMock = {
      provide: jest.fn(),
    };
    uuidProviderOutputPortMock = {
      generateV4: jest.fn(),
    };

    gameSlotManagementInputPort = new GameSlotManagementInputPort(
      cardV1FromCardBuilderMock,
      gameCanHoldMoreGameSlotsSpecMock,
      gameCanHoldOnlyOneMoreGameSlotSpecMock,
      gameSlotCreateQueryFromGameSlotCreateQueryV1BuilderMock,
      gameSlotV1FromGameSlotBuilderMock,
      gameSlotPersistenceOutputPortMock,
      gameSpecPersistenceOutputPortMock,
      nonStartedGameFilledEventHandlerMock,
      transactionProvisionOutputPortMock,
      uuidProviderOutputPortMock,
    );
  });

  describe('.create', () => {
    let gameFixture: Game;
    let gameSlotCreateQueryV1Fixture: apiModels.GameIdSlotCreateQueryV1;
    let gameSpecFixture: GameSpec;

    beforeAll(() => {
      gameFixture = NonStartedGameFixtures.any;
      gameSlotCreateQueryV1Fixture = GameSlotCreateQueryFixtures.any;
      gameSpecFixture = GameSpecFixtures.any;
    });

    describe('when called, and gameCanHoldMoreGameSlotsSpec.isSatisfiedBy() returns true and gameCanHoldOnlyOneMoreGameSlotSpec.isSatisfiedBy() returns false', () => {
      let gameSlotCreateQueryFixture: GameSlotCreateQuery;
      let gameSlotFixture: ActiveGameSlot | NonStartedGameSlot;
      let gameSlotV1Fixture: apiModels.GameSlotV1;
      let transactionWrapperMock: jest.Mocked<TransactionWrapper>;
      let uuidFixture: string;

      let result: unknown;

      beforeAll(async () => {
        gameSlotCreateQueryFixture = GameSlotCreateQueryFixtures.any;
        gameSlotFixture = NonStartedGameSlotFixtures.any;
        gameSlotV1Fixture = NonStartedGameSlotV1Fixtures.any;
        transactionWrapperMock = {
          [Symbol.asyncDispose]: jest.fn(),
          tryCommit: jest.fn(),
        } as Partial<
          jest.Mocked<TransactionWrapper>
        > as jest.Mocked<TransactionWrapper>;
        uuidFixture = 'uuid-fixture';

        gameCanHoldMoreGameSlotsSpecMock.isSatisfiedBy.mockReturnValueOnce(
          true,
        );
        gameCanHoldOnlyOneMoreGameSlotSpecMock.isSatisfiedBy.mockReturnValueOnce(
          false,
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
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
        );
        transactionProvisionOutputPortMock.provide.mockResolvedValueOnce(
          transactionWrapperMock,
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

      it('should call gameSpecPersistenceOutputPort.findOne()', () => {
        const expected: GameSpecFindQuery = {
          gameIds: [gameFixture.id],
        };

        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should call gameCanHoldMoreGameSlotsSpec.isSatisfiedBy()', () => {
        expect(
          gameCanHoldMoreGameSlotsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCanHoldMoreGameSlotsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(gameFixture, gameSpecFixture);
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
          transactionWrapperMock,
        );
      });

      it('should call gameCanHoldOnlyOneMoreGameSlotSpec.isSatisfiedBy()', () => {
        expect(
          gameCanHoldOnlyOneMoreGameSlotSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCanHoldOnlyOneMoreGameSlotSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(gameFixture, gameSpecFixture);
      });

      it('should not call nonStartedGameFilledEventHandler.handle()', () => {
        expect(
          nonStartedGameFilledEventHandlerMock.handle,
        ).not.toHaveBeenCalled();
      });

      it('should call transactionWrapper.tryCommit()', () => {
        expect(transactionWrapperMock.tryCommit).toHaveBeenCalledTimes(1);
        expect(transactionWrapperMock.tryCommit).toHaveBeenCalledWith();
      });

      it('should call gameSlotV1FromGameSlotBuilder.build()', () => {
        expect(gameSlotV1FromGameSlotBuilderMock.build).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSlotV1FromGameSlotBuilderMock.build).toHaveBeenCalledWith(
          gameSlotFixture,
        );
      });

      it('should call transactionWrapper[Symbol.asyncDispose]()', () => {
        expect(
          transactionWrapperMock[Symbol.asyncDispose],
        ).toHaveBeenCalledTimes(1);
        expect(
          transactionWrapperMock[Symbol.asyncDispose],
        ).toHaveBeenCalledWith();
      });

      it('should return a GameSlotV1', () => {
        expect(result).toBe(gameSlotV1Fixture);
      });
    });

    describe('when called, and gameCanHoldMoreGameSlotsSpec.isSatisfiedBy() returns true and gameCanHoldOnlyOneMoreGameSlotSpec.isSatisfiedBy() returns true', () => {
      let gameSlotCreateQueryFixture: GameSlotCreateQuery;
      let gameSlotFixture: ActiveGameSlot | NonStartedGameSlot;
      let gameSlotV1Fixture: apiModels.GameSlotV1;
      let transactionWrapperMock: jest.Mocked<TransactionWrapper>;
      let uuidFixture: string;

      let result: unknown;

      beforeAll(async () => {
        gameSlotCreateQueryFixture = GameSlotCreateQueryFixtures.any;
        gameSlotFixture = NonStartedGameSlotFixtures.any;
        gameSlotV1Fixture = NonStartedGameSlotV1Fixtures.any;
        transactionWrapperMock = {
          [Symbol.asyncDispose]: jest.fn(),
          tryCommit: jest.fn(),
        } as Partial<
          jest.Mocked<TransactionWrapper>
        > as jest.Mocked<TransactionWrapper>;
        uuidFixture = 'uuid-fixture';

        gameCanHoldMoreGameSlotsSpecMock.isSatisfiedBy.mockReturnValueOnce(
          true,
        );
        gameCanHoldOnlyOneMoreGameSlotSpecMock.isSatisfiedBy.mockReturnValueOnce(
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
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
        );
        nonStartedGameFilledEventHandlerMock.handle.mockResolvedValueOnce(
          undefined,
        );
        transactionProvisionOutputPortMock.provide.mockResolvedValueOnce(
          transactionWrapperMock,
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

      it('should call gameSpecPersistenceOutputPort.findOne()', () => {
        const expected: GameSpecFindQuery = {
          gameIds: [gameFixture.id],
        };

        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should call gameCanHoldMoreGameSlotsSpec.isSatisfiedBy()', () => {
        expect(
          gameCanHoldMoreGameSlotsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCanHoldMoreGameSlotsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(gameFixture, gameSpecFixture);
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
          transactionWrapperMock,
        );
      });

      it('should call gameCanHoldOnlyOneMoreGameSlotSpec.isSatisfiedBy()', () => {
        expect(
          gameCanHoldOnlyOneMoreGameSlotSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCanHoldOnlyOneMoreGameSlotSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(gameFixture, gameSpecFixture);
      });

      it('should call nonStartedGameFilledEventHandler.handle()', () => {
        const expected: NonStartedGameFilledEvent = {
          gameId: gameFixture.id,
        };

        expect(
          nonStartedGameFilledEventHandlerMock.handle,
        ).toHaveBeenCalledTimes(1);
        expect(
          nonStartedGameFilledEventHandlerMock.handle,
        ).toHaveBeenCalledWith(expected, transactionWrapperMock);
      });

      it('should call transactionWrapper.tryCommit()', () => {
        expect(transactionWrapperMock.tryCommit).toHaveBeenCalledTimes(1);
        expect(transactionWrapperMock.tryCommit).toHaveBeenCalledWith();
      });

      it('should call gameSlotV1FromGameSlotBuilder.build()', () => {
        expect(gameSlotV1FromGameSlotBuilderMock.build).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSlotV1FromGameSlotBuilderMock.build).toHaveBeenCalledWith(
          gameSlotFixture,
        );
      });

      it('should call transactionWrapper[Symbol.asyncDispose]()', () => {
        expect(
          transactionWrapperMock[Symbol.asyncDispose],
        ).toHaveBeenCalledTimes(1);
        expect(
          transactionWrapperMock[Symbol.asyncDispose],
        ).toHaveBeenCalledWith();
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
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
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

      it('should call gameSpecPersistenceOutputPort.findOne()', () => {
        const expected: GameSpecFindQuery = {
          gameIds: [gameFixture.id],
        };

        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should call gameCanHoldMoreGameSlotsSpec.isSatisfiedBy()', () => {
        expect(
          gameCanHoldMoreGameSlotsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCanHoldMoreGameSlotsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(gameFixture, gameSpecFixture);
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

  describe('.getSlotCards', () => {
    describe('having a NonStartGame', () => {
      let gameFixture: NonStartedGame;

      beforeAll(() => {
        gameFixture = NonStartedGameFixtures.any;
      });

      describe('when called', () => {
        let gameSlotIndexFixture: number;
        let result: unknown;

        beforeAll(() => {
          gameSlotIndexFixture = 0;

          try {
            gameSlotManagementInputPort.getSlotCards(
              gameFixture,
              gameSlotIndexFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an AppError', () => {
          const errorProperties: Partial<AppError> = {
            kind: AppErrorKind.unprocessableOperation,
            message: 'Unable to fetch cards from a non active game slot',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(errorProperties),
          );
        });
      });
    });

    describe('having an ActiveGame and a not existing index', () => {
      let gameFixture: ActiveGame;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.any;
      });

      describe('when called', () => {
        let gameSlotIndexFixture: number;
        let result: unknown;

        beforeAll(() => {
          gameSlotIndexFixture = -1;

          try {
            gameSlotManagementInputPort.getSlotCards(
              gameFixture,
              gameSlotIndexFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.entityNotFound,
            message: expect.stringContaining(
              'not found for game',
            ) as unknown as string,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe('having an ActiveGame and an existing index', () => {
      let gameSlotFixture: ActiveGameSlot;
      let gameFixture: ActiveGame;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withSlotsOne;
        [gameSlotFixture] = gameFixture.state.slots as [ActiveGameSlot];
      });

      describe('when called', () => {
        let cardV1Fixture: apiModels.CardV1;
        let gameSlotIndexFixture: number;
        let result: unknown;

        beforeAll(() => {
          cardV1Fixture = CardV1Fixtures.any;
          gameSlotIndexFixture = 0;

          cardV1FromCardBuilderMock.build.mockReturnValue(cardV1Fixture);

          result = gameSlotManagementInputPort.getSlotCards(
            gameFixture,
            gameSlotIndexFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          cardV1FromCardBuilderMock.build.mockReset();
        });

        it('should call cardV1FromCardBuilder.build()', () => {
          expect(cardV1FromCardBuilderMock.build).toHaveBeenCalledTimes(
            gameSlotFixture.cards.length,
          );

          gameSlotFixture.cards.forEach((card: Card, index: number) => {
            expect(cardV1FromCardBuilderMock.build).toHaveBeenNthCalledWith(
              index + 1,
              card,
            );
          });
        });

        it('should return a card array', () => {
          const expectedCards: apiModels.ActiveGameSlotCardsV1 =
            new Array<apiModels.CardV1>(gameSlotFixture.cards.length).fill(
              cardV1Fixture,
            );

          expect(result).toStrictEqual(expectedCards);
        });
      });
    });
  });

  describe('.isSlotOwner()', () => {
    describe('having a game with a single slot, a non existing slot index and a user', () => {
      let gameFixture: Game;
      let slotIndex: number;
      let userFixture: apiModels.UserV1;

      beforeAll(() => {
        gameFixture = NonStartedGameFixtures.withGameSlotsOne;
        slotIndex = -1;
        userFixture = UserV1Fixtures.any;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            gameSlotManagementInputPort.isSlotOwner(
              gameFixture,
              slotIndex,
              userFixture.id,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.entityNotFound,
            message: expect.stringContaining(
              'not found for game',
            ) as unknown as string,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe('having a game with a single slot, an existing slot index and a non owner user id', () => {
      let gameFixture: Game;
      let slotIndex: number;
      let userIdFixture: string;

      beforeAll(() => {
        gameFixture = NonStartedGameFixtures.withGameSlotsOne;
        slotIndex = 0;
        userIdFixture = Symbol() as unknown as string; // On purpose to avoid undesired collision
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSlotManagementInputPort.isSlotOwner(
            gameFixture,
            slotIndex,
            userIdFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });

    describe('having a game with a single slot, an existing slot index and the owner user id', () => {
      let gameFixture: Game;
      let slotIndex: number;
      let userIdFixture: string;

      beforeAll(() => {
        gameFixture = NonStartedGameFixtures.withGameSlotsOne;
        slotIndex = 0;
        userIdFixture = (
          gameFixture.state.slots[0] as ActiveGameSlot | NonStartedGameSlot
        ).userId;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSlotManagementInputPort.isSlotOwner(
            gameFixture,
            slotIndex,
            userIdFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });
    });
  });
});
