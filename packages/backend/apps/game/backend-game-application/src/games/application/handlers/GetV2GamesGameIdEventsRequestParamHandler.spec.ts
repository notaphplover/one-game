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
import { GetV2GamesGameIdEventsRequestParamHandler } from './GetV2GamesGameIdEventsRequestParamHandler';

describe(GetV2GamesGameIdEventsRequestParamHandler.name, () => {
  let getGameGameIdEventsV2RequestParamHandler: GetV2GamesGameIdEventsRequestParamHandler;

  beforeAll(() => {
    getGameGameIdEventsV2RequestParamHandler =
      new GetV2GamesGameIdEventsRequestParamHandler();
  });

  describe('.handle', () => {
    describe('having a Request with no last-event-id header, a stringified number gameSlotId param and service auth', () => {
      let gameFixture: Game;
      let requestFixture: Request &
        AuthRequestContextHolder &
        GameRequestContextHolder;

      beforeAll(() => {
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
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          try {
            await getGameGameIdEventsV2RequestParamHandler.handle(
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

    describe('having a Request with no last-event-id header, a stringified number gameSlotId param and user auth', () => {
      let gameFixture: Game;
      let userFixture: apiModels.UserV1;
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
          result =
            await getGameGameIdEventsV2RequestParamHandler.handle(
              requestFixture,
            );
        });

        it('should return a number and a game', () => {
          expect(result).toStrictEqual([
            requestFixture[requestContextProperty].game,
            userFixture,
            null,
          ]);
        });
      });
    });

    describe('having a Request with last-event-id header, a stringified number gameSlotId param and user auth', () => {
      let gameFixture: Game;
      let userFixture: apiModels.UserV1;
      let lastEventIdFixture: string;
      let requestFixture: Request &
        AuthRequestContextHolder &
        GameRequestContextHolder;

      beforeAll(() => {
        gameFixture = NonStartedGameFixtures.any;
        userFixture = UserV1Fixtures.any;
        lastEventIdFixture = 'last-event-id-fixture';
        requestFixture = {
          headers: {
            'last-event-id': lastEventIdFixture,
          },
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
          result =
            await getGameGameIdEventsV2RequestParamHandler.handle(
              requestFixture,
            );
        });

        it('should return a number and a game', () => {
          expect(result).toStrictEqual([
            requestFixture[requestContextProperty].game,
            userFixture,
            lastEventIdFixture,
          ]);
        });
      });
    });
  });
});
