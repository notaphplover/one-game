import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  CurrentPlayerCanPlayCardsSpec,
  GameFindQuery,
  GameOptions,
  GameOptionsFindQuery,
  GameService,
  GameUpdateQuery,
  PlayerCanUpdateGameSpec,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameFixtures,
  ActiveGameSlotFixtures,
  GameOptionsFixtures,
  GameUpdateQueryFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { UserV1Fixtures } from '../../../users/application/fixtures/models/UserV1Fixtures';
import { GameIdPlayCardsQueryV1Fixtures } from '../fixtures/GameIdPlayCardsQueryV1Fixtures';
import { GameOptionsPersistenceOutputPort } from '../ports/output/GameOptionsPersistenceOutputPort';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameIdPlayCardsQueryV1Handler } from './GameIdPlayCardsQueryV1Handler';

describe(GameIdPlayCardsQueryV1Handler.name, () => {
  let gameOptionsPersistenceOutputPortMock: jest.Mocked<GameOptionsPersistenceOutputPort>;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;
  let gameServiceMock: jest.Mocked<GameService>;
  let playerCanUpdateGameSpecMock: jest.Mocked<PlayerCanUpdateGameSpec>;
  let cardColorFromCardColorV1BuilderMock: jest.Mocked<
    Builder<CardColor, [apiModels.CardColorV1]>
  >;
  let currentPlayerCanPlayCardsSpecMock: jest.Mocked<CurrentPlayerCanPlayCardsSpec>;

  let gameIdPlayCardsQueryV1Handler: GameIdPlayCardsQueryV1Handler;

  beforeAll(() => {
    gameOptionsPersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GameOptionsPersistenceOutputPort>
    > as jest.Mocked<GameOptionsPersistenceOutputPort>;
    gamePersistenceOutputPortMock = {
      findOne: jest.fn(),
      update: jest.fn(),
    } as Partial<
      jest.Mocked<GamePersistenceOutputPort>
    > as jest.Mocked<GamePersistenceOutputPort>;
    gameServiceMock = {
      buildPlayCardsGameUpdateQuery: jest.fn(),
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;
    playerCanUpdateGameSpecMock = {
      isSatisfiedBy: jest.fn(),
    };
    cardColorFromCardColorV1BuilderMock = {
      build: jest.fn(),
    };
    currentPlayerCanPlayCardsSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<CurrentPlayerCanPlayCardsSpec>
    > as jest.Mocked<CurrentPlayerCanPlayCardsSpec>;

    gameIdPlayCardsQueryV1Handler = new GameIdPlayCardsQueryV1Handler(
      gameOptionsPersistenceOutputPortMock,
      gamePersistenceOutputPortMock,
      gameServiceMock,
      playerCanUpdateGameSpecMock,
      cardColorFromCardColorV1BuilderMock,
      currentPlayerCanPlayCardsSpecMock,
    );
  });

  describe('having a gameId and GameIdPlayCardsQueryV1 with no colorChoice', () => {
    let gameIdFixture: string;
    let gameIdPlayCardsQueryV1Fixture: apiModels.GameIdPlayCardsQueryV1;
    let userV1Fixture: apiModels.UserV1;

    beforeAll(() => {
      gameIdFixture = ActiveGameFixtures.any.id;
      gameIdPlayCardsQueryV1Fixture =
        GameIdPlayCardsQueryV1Fixtures.withColorChoice;
      userV1Fixture = UserV1Fixtures.any;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(undefined);
        gameOptionsPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          GameOptionsFixtures.any,
        );

        try {
          await gameIdPlayCardsQueryV1Handler.handle(
            gameIdFixture,
            gameIdPlayCardsQueryV1Fixture,
            userV1Fixture,
          );
        } catch (error) {
          result = error;
        }
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

      it('should call gameOptionsPersistenceOutputPort.findOne()', () => {
        const expectedGameOptionsFindQuery: GameOptionsFindQuery = {
          gameId: gameIdFixture,
        };

        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledWith(expectedGameOptionsFindQuery);
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.entityNotFound,
          message: `Game "${gameIdFixture}" not found`,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and gameOptionsPersistenceOutputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          ActiveGameFixtures.any,
        );
        gameOptionsPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          undefined,
        );

        try {
          await gameIdPlayCardsQueryV1Handler.handle(
            gameIdFixture,
            gameIdPlayCardsQueryV1Fixture,
            userV1Fixture,
          );
        } catch (error) {
          result = error;
        }
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

      it('should call gameOptionsPersistenceOutputPort.findOne()', () => {
        const expectedGameOptionsFindQuery: GameOptionsFindQuery = {
          gameId: gameIdFixture,
        };

        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledWith(expectedGameOptionsFindQuery);
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unknown,
          message: `Expecting game "${gameIdFixture}" to have options, none found`,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });

  describe('having a gameId, a gameIdPassTurnQueryV1 with an existing slot index and a user', () => {
    let gameIdFixture: string;
    let gameIdPlayCardsQueryV1Fixture: apiModels.GameIdPlayCardsQueryV1;
    let userV1Fixture: apiModels.UserV1;

    beforeAll(() => {
      gameIdFixture = ActiveGameFixtures.any.id;
      gameIdPlayCardsQueryV1Fixture =
        GameIdPlayCardsQueryV1Fixtures.withSlotIndexZero;
      userV1Fixture = UserV1Fixtures.any;
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameOptionsPersistenceOutputPort.findOne() returns GameOptions and playerCanUpdateGameSpec.isSatisfiedBy returns false', () => {
      let activeGameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;
      let gameUpdateQueryFixture: GameUpdateQuery;

      let result: unknown;

      beforeAll(async () => {
        const anyFixtures: ActiveGame = ActiveGameFixtures.any;

        activeGameFixture = {
          ...anyFixtures,
          state: {
            ...anyFixtures.state,
            currentPlayingSlotIndex: 0,
            slots: [
              {
                ...ActiveGameSlotFixtures.withPositionZero,
                userId: userV1Fixture.id,
              },
              ActiveGameSlotFixtures.withPositionOne,
            ],
          },
        };
        gameOptionsFixture = GameOptionsFixtures.any;
        gameUpdateQueryFixture = GameUpdateQueryFixtures.any;

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          activeGameFixture,
        );
        gameOptionsPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameOptionsFixture,
        );

        gameServiceMock.buildPlayCardsGameUpdateQuery.mockReturnValueOnce(
          gameUpdateQueryFixture,
        );

        playerCanUpdateGameSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

        try {
          await gameIdPlayCardsQueryV1Handler.handle(
            gameIdFixture,
            gameIdPlayCardsQueryV1Fixture,
            userV1Fixture,
          );
        } catch (error: unknown) {
          result = error;
        }
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

      it('should call gameOptionsPersistenceOutputPort.findOne()', () => {
        const expectedGameOptionsFindQuery: GameOptionsFindQuery = {
          gameId: gameIdFixture,
        };

        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledWith(expectedGameOptionsFindQuery);
      });

      it('should call playerCanUpdateGameSpec.isSatisfiedBy()', () => {
        expect(playerCanUpdateGameSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(playerCanUpdateGameSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          activeGameFixture,
          userV1Fixture.id,
          gameIdPlayCardsQueryV1Fixture.slotIndex,
        );
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message:
            'Invalid game update request. Expecting the owner of the playing slot to perform this action',
        };

        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameOptionsPersistenceOutputPort.findOne() returns GameOptions and playerCanUpdateGameSpec.isSatisfiedBy returns true and playerCanPlayCardsSpec.isSatisfiedBy returns false', () => {
      let activeGameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;
      let gameUpdateQueryFixture: GameUpdateQuery;

      let result: unknown;

      beforeAll(async () => {
        const anyFixtures: ActiveGame = ActiveGameFixtures.any;

        activeGameFixture = {
          ...anyFixtures,
          state: {
            ...anyFixtures.state,
            currentPlayingSlotIndex: 0,
            slots: [
              {
                ...ActiveGameSlotFixtures.withPositionZero,
                userId: userV1Fixture.id,
              },
              ActiveGameSlotFixtures.withPositionOne,
            ],
          },
        };
        gameOptionsFixture = GameOptionsFixtures.any;
        gameUpdateQueryFixture = GameUpdateQueryFixtures.any;

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          activeGameFixture,
        );
        gameOptionsPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameOptionsFixture,
        );

        gameServiceMock.buildPlayCardsGameUpdateQuery.mockReturnValueOnce(
          gameUpdateQueryFixture,
        );

        playerCanUpdateGameSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        currentPlayerCanPlayCardsSpecMock.isSatisfiedBy.mockReturnValueOnce(
          false,
        );

        try {
          await gameIdPlayCardsQueryV1Handler.handle(
            gameIdFixture,
            gameIdPlayCardsQueryV1Fixture,
            userV1Fixture,
          );
        } catch (error: unknown) {
          result = error;
        }
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

      it('should call gameOptionsPersistenceOutputPort.findOne()', () => {
        const expectedGameOptionsFindQuery: GameOptionsFindQuery = {
          gameId: gameIdFixture,
        };

        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledWith(expectedGameOptionsFindQuery);
      });

      it('should call playerCanUpdateGameSpec.isSatisfiedBy()', () => {
        expect(playerCanUpdateGameSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(playerCanUpdateGameSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          activeGameFixture,
          userV1Fixture.id,
          gameIdPlayCardsQueryV1Fixture.slotIndex,
        );
      });

      it('should call playerCanPlayCardsSpec.isSatisfiedBy()', () => {
        expect(
          currentPlayerCanPlayCardsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          currentPlayerCanPlayCardsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(
          activeGameFixture,
          gameOptionsFixture,
          gameIdPlayCardsQueryV1Fixture.cardIndexes,
        );
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message:
            'Operation not allowed. Reason: selected cards cannot be played in the current context',
        };

        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameOptionsPersistenceOutputPort.findOne() returns GameOptions and playerCanUpdateGameSpec.isSatisfiedBy returns true and playerCanPlayCardsSpec.isSatisfiedBy returns true', () => {
      let activeGameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;
      let gameUpdateQueryFixture: GameUpdateQuery;

      let result: unknown;

      beforeAll(async () => {
        const anyFixtures: ActiveGame = ActiveGameFixtures.any;

        activeGameFixture = {
          ...anyFixtures,
          state: {
            ...anyFixtures.state,
            currentPlayingSlotIndex: 0,
            slots: [
              {
                ...ActiveGameSlotFixtures.withPositionZero,
                userId: userV1Fixture.id,
              },
              ActiveGameSlotFixtures.withPositionOne,
            ],
          },
        };
        gameOptionsFixture = GameOptionsFixtures.any;
        gameUpdateQueryFixture = GameUpdateQueryFixtures.any;

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          activeGameFixture,
        );
        gameOptionsPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameOptionsFixture,
        );

        gameServiceMock.buildPlayCardsGameUpdateQuery.mockReturnValueOnce(
          gameUpdateQueryFixture,
        );

        playerCanUpdateGameSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        currentPlayerCanPlayCardsSpecMock.isSatisfiedBy.mockReturnValueOnce(
          true,
        );

        result = await gameIdPlayCardsQueryV1Handler.handle(
          gameIdFixture,
          gameIdPlayCardsQueryV1Fixture,
          userV1Fixture,
        );
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

      it('should call gameOptionsPersistenceOutputPort.findOne()', () => {
        const expectedGameOptionsFindQuery: GameOptionsFindQuery = {
          gameId: gameIdFixture,
        };

        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledWith(expectedGameOptionsFindQuery);
      });

      it('should call playerCanUpdateGameSpec.isSatisfiedBy()', () => {
        expect(playerCanUpdateGameSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(playerCanUpdateGameSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          activeGameFixture,
          userV1Fixture.id,
          gameIdPlayCardsQueryV1Fixture.slotIndex,
        );
      });

      it('should call playerCanPlayCardsSpec.isSatisfiedBy()', () => {
        expect(
          currentPlayerCanPlayCardsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          currentPlayerCanPlayCardsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(
          activeGameFixture,
          gameOptionsFixture,
          gameIdPlayCardsQueryV1Fixture.cardIndexes,
        );
      });

      it('should call gameService.buildPlayCardsGameUpdateQuery()', () => {
        expect(
          gameServiceMock.buildPlayCardsGameUpdateQuery,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameServiceMock.buildPlayCardsGameUpdateQuery,
        ).toHaveBeenCalledWith(
          activeGameFixture,
          gameIdPlayCardsQueryV1Fixture.cardIndexes,
          gameIdPlayCardsQueryV1Fixture.slotIndex,
          undefined,
        );
      });

      it('should call gamePersistenceOutputPort.update()', () => {
        expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledWith(
          gameUpdateQueryFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
