import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { NonStartedGameFixtures } from '@cornie-js/backend-app-game-fixtures/games/domain';
import { UserV1Fixtures } from '@cornie-js/backend-app-game-fixtures/users/application';
import { Game } from '@cornie-js/backend-app-game-models/games/domain';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  AuthKind,
  AuthRequestContextHolder,
  Request,
  requestContextProperty,
} from '@cornie-js/backend-http';

import { GameRequestContextHolder } from '../models/GameRequestContextHolder';
import {
  GET_GAME_GAME_ID_SLOT_SLOT_ID_REQUEST_PARAM,
  GetGameGameIdSlotSlotIdCardsV1RequestParamHandler,
} from './GetGameGameIdSlotSlotIdCardsV1RequestParamHandler';

describe(GetGameGameIdSlotSlotIdCardsV1RequestParamHandler.name, () => {
  let getGameGameIdSlotSlotIdCardsV1RequestParamHandler: GetGameGameIdSlotSlotIdCardsV1RequestParamHandler;

  beforeAll(() => {
    getGameGameIdSlotSlotIdCardsV1RequestParamHandler =
      new GetGameGameIdSlotSlotIdCardsV1RequestParamHandler();
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
              kind: AuthKind.user,
              user: userFixture,
            },
            game: gameFixture,
          },
          urlParameters: {
            [GET_GAME_GAME_ID_SLOT_SLOT_ID_REQUEST_PARAM]:
              gameSlotPositionStringifiedFixture,
          },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          result =
            await getGameGameIdSlotSlotIdCardsV1RequestParamHandler.handle(
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
            [GET_GAME_GAME_ID_SLOT_SLOT_ID_REQUEST_PARAM]:
              gameSlotPositionStringifiedFixture,
          },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          try {
            await getGameGameIdSlotSlotIdCardsV1RequestParamHandler.handle(
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
              kind: AuthKind.user,
              user: userFixture,
            },
            game: gameFixture,
          },
          urlParameters: {
            [GET_GAME_GAME_ID_SLOT_SLOT_ID_REQUEST_PARAM]:
              gameSlotPositionStringifiedFixture,
          },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          try {
            await getGameGameIdSlotSlotIdCardsV1RequestParamHandler.handle(
              requestFixture,
            );
          } catch (error) {
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
            await getGameGameIdSlotSlotIdCardsV1RequestParamHandler.handle(
              requestFixture,
            );
          } catch (error) {
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
