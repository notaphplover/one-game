import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@one-game-js/api-models';
import { AppError, AppErrorKind, Builder } from '@one-game-js/backend-common';

import { CardV1Fixtures } from '../../../../cards/application/fixtures/CardV1Fixtures';
import { Card } from '../../../../cards/domain/models/Card';
import { UuidProviderOutputPort } from '../../../../foundation/common/application/ports/output/UuidProviderOutputPort';
import { UserV1Fixtures } from '../../../../user/application/fixtures/models/UserV1Fixtures';
import { ActiveGameFixtures } from '../../../domain/fixtures/ActiveGameFixtures';
import { GameSlotCreateQueryFixtures } from '../../../domain/fixtures/GameSlotCreateQueryFixtures';
import { NonStartedGameFixtures } from '../../../domain/fixtures/NonStartedGameFixtures';
import { NonStartedGameSlotFixtures } from '../../../domain/fixtures/NonStartedGameSlotFixtures';
import { ActiveGame } from '../../../domain/models/ActiveGame';
import { ActiveGameSlot } from '../../../domain/models/ActiveGameSlot';
import { Game } from '../../../domain/models/Game';
import { NonStartedGame } from '../../../domain/models/NonStartedGame';
import { NonStartedGameSlot } from '../../../domain/models/NonStartedGameSlot';
import { GameSlotCreateQuery } from '../../../domain/query/GameSlotCreateQuery';
import { GameCanHoldMoreGameSlotsSpec } from '../../../domain/specs/GameCanHoldMoreGameSlotsSpec';
import { NonStartedGameSlotV1Fixtures } from '../../fixtures/NonStartedGameSlotV1Fixtures';
import { GameSlotCreateQueryContext } from '../../models/GameSlotCreateQueryContext';
import { GameSlotPersistenceOutputPort } from '../output/GameSlotPersistenceOutputPort';
import { GameSlotManagementInputPort } from './GameSlotManagementInputPort';

describe(GameSlotManagementInputPort.name, () => {
  let cardV1FromCardBuilderMock: jest.Mocked<Builder<apiModels.CardV1, [Card]>>;
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
    cardV1FromCardBuilderMock = {
      build: jest.fn(),
    };
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
      cardV1FromCardBuilderMock,
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
          } catch (error) {
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
        [gameSlotFixture] = gameFixture.slots as [ActiveGameSlot];
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
        gameFixture = NonStartedGameFixtures.withGameSlotsAmountOneAndSlotsOne;
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
          } catch (error) {
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
        gameFixture = NonStartedGameFixtures.withGameSlotsAmountOneAndSlotsOne;
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
        gameFixture = NonStartedGameFixtures.withGameSlotsAmountOneAndSlotsOne;
        slotIndex = 0;
        userIdFixture = (
          gameFixture.slots[0] as ActiveGameSlot | NonStartedGameSlot
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
