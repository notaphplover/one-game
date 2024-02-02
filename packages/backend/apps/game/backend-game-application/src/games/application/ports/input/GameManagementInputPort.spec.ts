import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import { Game, GameFindQuery } from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameFixtures,
  GameFindQueryFixtures,
  NonStartedGameFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { UserV1Fixtures } from '../../../../users/application/fixtures/models/UserV1Fixtures';
import { ActiveGameV1Fixtures } from '../../fixtures/ActiveGameV1Fixtures';
import { GameCreateQueryV1Fixtures } from '../../fixtures/GameCreateQueryV1Fixtures';
import { GameIdPassTurnQueryV1Fixtures } from '../../fixtures/GameIdPassTurnQueryV1Fixtures';
import { GameIdPlayCardsQueryV1Fixtures } from '../../fixtures/GameIdPlayCardsQueryV1Fixtures';
import { NonStartedGameV1Fixtures } from '../../fixtures/NonStartedGameV1Fixtures';
import { GamePersistenceOutputPort } from '../../ports/output/GamePersistenceOutputPort';
import { GameManagementInputPort } from './GameManagementInputPort';

describe(GameManagementInputPort.name, () => {
  let createGameUseCaseHandlerMock: jest.Mocked<
    Handler<[apiModels.GameCreateQueryV1], apiModels.GameV1>
  >;
  let gameIdPassTurnQueryV1HandlerMock: jest.Mocked<
    Handler<[string, apiModels.GameIdPassTurnQueryV1, apiModels.UserV1], void>
  >;
  let gameIdPlayCardsQueryV1HandlerMock: jest.Mocked<
    Handler<[string, apiModels.GameIdPlayCardsQueryV1, apiModels.UserV1], void>
  >;
  let gameV1FromGameBuilderMock: jest.Mocked<Builder<apiModels.GameV1, [Game]>>;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;

  let gameManagementInputPort: GameManagementInputPort;

  beforeAll(() => {
    createGameUseCaseHandlerMock = {
      handle: jest.fn(),
    };
    gameIdPassTurnQueryV1HandlerMock = {
      handle: jest.fn(),
    };
    gameIdPlayCardsQueryV1HandlerMock = {
      handle: jest.fn(),
    };
    gameV1FromGameBuilderMock = {
      build: jest.fn(),
    };
    gamePersistenceOutputPortMock = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    gameManagementInputPort = new GameManagementInputPort(
      createGameUseCaseHandlerMock,
      gameIdPassTurnQueryV1HandlerMock,
      gameIdPlayCardsQueryV1HandlerMock,
      gameV1FromGameBuilderMock,
      gamePersistenceOutputPortMock,
    );
  });

  describe('.create', () => {
    let gameCreateQueryV1Fixture: apiModels.GameCreateQueryV1;

    beforeAll(() => {
      gameCreateQueryV1Fixture = GameCreateQueryV1Fixtures.any;
    });

    describe('when called', () => {
      let gameV1Fixture: apiModels.GameV1;

      let result: unknown;

      beforeAll(async () => {
        gameV1Fixture = ActiveGameV1Fixtures.any;

        createGameUseCaseHandlerMock.handle.mockResolvedValueOnce(
          gameV1Fixture,
        );

        result = await gameManagementInputPort.create(gameCreateQueryV1Fixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createGameUseCaseHandler.handle()', () => {
        expect(createGameUseCaseHandlerMock.handle).toHaveBeenCalledTimes(1);
        expect(createGameUseCaseHandlerMock.handle).toHaveBeenCalledWith(
          gameCreateQueryV1Fixture,
        );
      });

      it('should return a GameV1', () => {
        expect(result).toBe(gameV1Fixture);
      });
    });
  });

  describe('.find', () => {
    let gameFindQueryFixture: GameFindQuery;

    beforeAll(() => {
      gameFindQueryFixture = GameFindQueryFixtures.any;
    });

    describe('when called, and gamePersistenceOutputPort.find() returns a Game array with one element', () => {
      let gameFixture: Game;
      let gameV1Fixture: apiModels.GameV1;

      let result: unknown;

      beforeAll(async () => {
        gameFixture = NonStartedGameFixtures.any;
        gameV1Fixture = NonStartedGameV1Fixtures.any;

        gamePersistenceOutputPortMock.find.mockResolvedValueOnce([gameFixture]);

        gameV1FromGameBuilderMock.build.mockReturnValueOnce(gameV1Fixture);

        result = await gameManagementInputPort.find(gameFindQueryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        expect(gamePersistenceOutputPortMock.find).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.find).toHaveBeenCalledWith(
          gameFindQueryFixture,
        );
      });

      it('should call gameV1FromGameBuilder.build()', () => {
        expect(gameV1FromGameBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(gameV1FromGameBuilderMock.build).toHaveBeenCalledWith(
          gameFixture,
        );
      });

      it('should return a gameV1', () => {
        expect(result).toStrictEqual([gameV1Fixture]);
      });
    });
  });

  describe('.findOne', () => {
    let gameFindQueryFixture: GameFindQuery;

    beforeAll(() => {
      gameFindQueryFixture = GameFindQueryFixtures.any;
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

        result = await gameManagementInputPort.findOne(gameFindQueryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          gameFindQueryFixture,
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

  describe('.updateOne', () => {
    describe('having a gameId and a userV1', () => {
      let gameIdFixture: string;
      let userV1Fixture: apiModels.UserV1;

      beforeAll(() => {
        gameIdFixture = ActiveGameFixtures.any.id;
        userV1Fixture = UserV1Fixtures.any;
      });

      describe('having a GameIdPassTurnQueryV1', () => {
        let gameIdPassTurnQueryV1Fixture: apiModels.GameIdPassTurnQueryV1;

        beforeAll(() => {
          gameIdPassTurnQueryV1Fixture = GameIdPassTurnQueryV1Fixtures.any;
        });

        describe('when called, and gamePersistenceOutputPort.findOne() returns a Game', () => {
          let gameFixture: Game;
          let gameV1Fixture: apiModels.GameV1;

          let result: unknown;

          beforeAll(async () => {
            gameFixture = ActiveGameFixtures.any;
            gameV1Fixture = ActiveGameV1Fixtures.any;

            gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
              gameFixture,
            );

            gameV1FromGameBuilderMock.build.mockReturnValueOnce(gameV1Fixture);

            result = await gameManagementInputPort.updateOne(
              gameIdFixture,
              gameIdPassTurnQueryV1Fixture,
              userV1Fixture,
            );
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call gameIdPassTurnQueryV1Handler.handle()', () => {
            expect(
              gameIdPassTurnQueryV1HandlerMock.handle,
            ).toHaveBeenCalledTimes(1);
            expect(
              gameIdPassTurnQueryV1HandlerMock.handle,
            ).toHaveBeenCalledWith(
              gameIdFixture,
              gameIdPassTurnQueryV1Fixture,
              userV1Fixture,
            );
          });

          it('should call gamePersistenceOutputPort.findOne()', () => {
            const expectedGameFindQuery: GameFindQuery = {
              id: gameIdFixture,
            };

            expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
              1,
            );
            expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
              expectedGameFindQuery,
            );
          });

          it('should call gameV1FromGameBuilderMock.build()', () => {
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

      describe('having a GameIdPlayCardsQueryV1', () => {
        let gameIdPlayCardsQueryV1Fixture: apiModels.GameIdPlayCardsQueryV1;

        beforeAll(() => {
          gameIdPlayCardsQueryV1Fixture = GameIdPlayCardsQueryV1Fixtures.any;
        });

        describe('when called, and gamePersistenceOutputPort.findOne() returns a Game', () => {
          let gameFixture: Game;
          let gameV1Fixture: apiModels.GameV1;

          let result: unknown;

          beforeAll(async () => {
            gameFixture = ActiveGameFixtures.any;
            gameV1Fixture = ActiveGameV1Fixtures.any;

            gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
              gameFixture,
            );

            gameV1FromGameBuilderMock.build.mockReturnValueOnce(gameV1Fixture);

            result = await gameManagementInputPort.updateOne(
              gameIdFixture,
              gameIdPlayCardsQueryV1Fixture,
              userV1Fixture,
            );
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call gameIdPlayCardsQueryV1Handler.handle()', () => {
            expect(
              gameIdPlayCardsQueryV1HandlerMock.handle,
            ).toHaveBeenCalledTimes(1);
            expect(
              gameIdPlayCardsQueryV1HandlerMock.handle,
            ).toHaveBeenCalledWith(
              gameIdFixture,
              gameIdPlayCardsQueryV1Fixture,
              userV1Fixture,
            );
          });

          it('should call gamePersistenceOutputPort.findOne()', () => {
            const expectedGameFindQuery: GameFindQuery = {
              id: gameIdFixture,
            };

            expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
              1,
            );
            expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
              expectedGameFindQuery,
            );
          });

          it('should call gameV1FromGameBuilderMock.build()', () => {
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
    });
  });
});
