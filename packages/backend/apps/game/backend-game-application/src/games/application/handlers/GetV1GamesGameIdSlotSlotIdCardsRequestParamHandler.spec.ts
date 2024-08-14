import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Game } from '@cornie-js/backend-game-domain/games';
import { NonStartedGameFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import {
  AuthKind,
  AuthRequestContextHolder,
  Request,
  requestContextProperty,
} from '@cornie-js/backend-http';

import { UserV1Fixtures } from '../../../users/application/fixtures/models/UserV1Fixtures';
import { GameRequestContextHolder } from '../models/GameRequestContextHolder';
import { GetV1GamesGameIdSlotSlotIdCardsRequestParamHandler } from './GetV1GamesGameIdSlotSlotIdCardsRequestParamHandler';

describe(GetV1GamesGameIdSlotSlotIdCardsRequestParamHandler.name, () => {
  let getV1GamesGameIdSlotSlotIdCardsRequestParamHandler: GetV1GamesGameIdSlotSlotIdCardsRequestParamHandler;

  beforeAll(() => {
    getV1GamesGameIdSlotSlotIdCardsRequestParamHandler =
      new GetV1GamesGameIdSlotSlotIdCardsRequestParamHandler();
  });

  describe('.handle', () => {
    describe('having a Request with a stringified number gameSlotId param and user auth', () => {
      let gameSlotPositionFixture: number;
      let gameSlotPositionStringifiedFixture: string;
      let gameFixture: Game;
      let userFixture: apiModels.UserV1;
      let requestFixture: Request &
        AuthRequestContextHolder &
        GameRequestContextHolder;

      beforeAll(() => {
        gameSlotPositionFixture = 0;
        gameSlotPositionStringifiedFixture = '0';
        gameFixture = NonStartedGameFixtures.any;
        userFixture = UserV1Fixtures.any;
        requestFixture = {
          headers: {},
          query: {},
          [requestContextProperty]: {
            auth: {
              jwtPayload: {
                [Symbol()]: Symbol(),
              },
              kind: AuthKind.user,
              user: userFixture,
            },
            game: gameFixture,
          },
          urlParameters: {
            [GetV1GamesGameIdSlotSlotIdCardsRequestParamHandler.getGameGameIdSlotSlotIdRequestParam]:
              gameSlotPositionStringifiedFixture,
          },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          result =
            await getV1GamesGameIdSlotSlotIdCardsRequestParamHandler.handle(
              requestFixture,
            );
        });

        it('should return a number and a game', () => {
          expect(result).toStrictEqual([
            gameSlotPositionFixture,
            requestFixture[requestContextProperty].game,
            userFixture,
          ]);
        });
      });
    });

    describe('having a Request with a stringified number gameSlotId param and service auth', () => {
      let gameSlotPositionStringifiedFixture: string;
      let gameFixture: Game;
      let requestFixture: Request &
        AuthRequestContextHolder &
        GameRequestContextHolder;

      beforeAll(() => {
        gameSlotPositionStringifiedFixture = '0';
        gameFixture = NonStartedGameFixtures.any;
        requestFixture = {
          headers: {},
          query: {},
          [requestContextProperty]: {
            auth: {
              kind: AuthKind.backendService,
            },
            game: gameFixture,
          },
          urlParameters: {
            [GetV1GamesGameIdSlotSlotIdCardsRequestParamHandler.getGameGameIdSlotSlotIdRequestParam]:
              gameSlotPositionStringifiedFixture,
          },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          try {
            await getV1GamesGameIdSlotSlotIdCardsRequestParamHandler.handle(
              requestFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an Error', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.invalidCredentials,
            message: 'Expecting user based credentials',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe('having a Request with a non stringified number gameSlotId param', () => {
      let gameSlotPositionStringifiedFixture: string;
      let gameFixture: Game;
      let userFixture: apiModels.UserV1;
      let requestFixture: Request &
        AuthRequestContextHolder &
        GameRequestContextHolder;

      beforeAll(() => {
        gameSlotPositionStringifiedFixture = 'not-a-number';
        gameFixture = NonStartedGameFixtures.any;
        userFixture = UserV1Fixtures.any;
        requestFixture = {
          headers: {},
          query: {},
          [requestContextProperty]: {
            auth: {
              jwtPayload: {
                [Symbol()]: Symbol(),
              },
              kind: AuthKind.user,
              user: userFixture,
            },
            game: gameFixture,
          },
          urlParameters: {
            [GetV1GamesGameIdSlotSlotIdCardsRequestParamHandler.getGameGameIdSlotSlotIdRequestParam]:
              gameSlotPositionStringifiedFixture,
          },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          try {
            await getV1GamesGameIdSlotSlotIdCardsRequestParamHandler.handle(
              requestFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an error', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.contractViolation,
            message: 'Invalid slot index',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe('having a Request with no gameSlotId param', () => {
      let userFixture: apiModels.UserV1;
      let gameFixture: Game;
      let requestFixture: Request &
        AuthRequestContextHolder &
        GameRequestContextHolder;

      beforeAll(() => {
        gameFixture = NonStartedGameFixtures.any;
        userFixture = UserV1Fixtures.any;
        requestFixture = {
          headers: {},
          query: {},
          [requestContextProperty]: {
            auth: {
              jwtPayload: {
                [Symbol()]: Symbol(),
              },
              kind: AuthKind.user,
              user: userFixture,
            },
            game: gameFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          try {
            await getV1GamesGameIdSlotSlotIdCardsRequestParamHandler.handle(
              requestFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an error', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: 'Unable to obtain request slot index from request url',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });
  });
});
