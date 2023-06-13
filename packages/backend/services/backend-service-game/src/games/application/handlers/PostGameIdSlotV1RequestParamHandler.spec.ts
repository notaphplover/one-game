import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Game } from '@cornie-js/backend-app-game-domain/games/domain';
import { GameSlotCreateV1Fixtures } from '@cornie-js/backend-app-game-fixtures/games/application';
import { NonStartedGameFixtures } from '@cornie-js/backend-app-game-fixtures/games/domain';
import { UserV1Fixtures } from '@cornie-js/backend-app-game-fixtures/users/application';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import {
  AuthKind,
  AuthRequestContextHolder,
  RequestWithBody,
  requestContextProperty,
} from '@cornie-js/backend-http';

import { GameRequestContextHolder } from '../models/GameRequestContextHolder';
import { PostGameIdSlotV1RequestParamHandler } from './PostGameIdSlotV1RequestParamHandler';

describe(PostGameIdSlotV1RequestParamHandler.name, () => {
  let postGameIdSlotV1RequestBodyHandlerMock: jest.Mocked<
    Handler<[RequestWithBody], [apiModels.GameIdSlotCreateQueryV1]>
  >;

  let postGameIdSlotV1RequestParamHandler: PostGameIdSlotV1RequestParamHandler;

  beforeAll(() => {
    postGameIdSlotV1RequestBodyHandlerMock = {
      handle: jest.fn(),
    };

    postGameIdSlotV1RequestParamHandler =
      new PostGameIdSlotV1RequestParamHandler(
        postGameIdSlotV1RequestBodyHandlerMock,
      );
  });

  describe('.handle', () => {
    describe('having a request with backend auth', () => {
      let requestFixture: RequestWithBody &
        AuthRequestContextHolder &
        GameRequestContextHolder;

      beforeAll(() => {
        requestFixture = {
          [requestContextProperty]: {
            auth: {
              kind: AuthKind.backendService,
            },
            game: NonStartedGameFixtures.any,
          },
        } as Partial<
          RequestWithBody & AuthRequestContextHolder & GameRequestContextHolder
        > as RequestWithBody &
          AuthRequestContextHolder &
          GameRequestContextHolder;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          try {
            await postGameIdSlotV1RequestParamHandler.handle(requestFixture);
          } catch (error) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
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

    describe('having a request with user auth', () => {
      let userFixture: apiModels.UserV1;
      let requestFixture: RequestWithBody &
        AuthRequestContextHolder &
        GameRequestContextHolder;

      beforeAll(() => {
        userFixture = UserV1Fixtures.any;

        requestFixture = {
          [requestContextProperty]: {
            auth: {
              kind: AuthKind.user,
              user: userFixture,
            },
            game: NonStartedGameFixtures.any,
          },
        } as Partial<
          RequestWithBody & AuthRequestContextHolder & GameRequestContextHolder
        > as RequestWithBody &
          AuthRequestContextHolder &
          GameRequestContextHolder;
      });

      describe('when called', () => {
        let gameIdSlotCreateQueryV1Fixture: apiModels.GameIdSlotCreateQueryV1;

        let result: unknown;

        beforeAll(async () => {
          gameIdSlotCreateQueryV1Fixture = GameSlotCreateV1Fixtures.any;

          postGameIdSlotV1RequestBodyHandlerMock.handle.mockResolvedValueOnce([
            gameIdSlotCreateQueryV1Fixture,
          ]);

          result = await postGameIdSlotV1RequestParamHandler.handle(
            requestFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call postGameIdSlotV1RequestBodyHandlerMock.handle()', () => {
          expect(
            postGameIdSlotV1RequestBodyHandlerMock.handle,
          ).toHaveBeenCalledTimes(1);
          expect(
            postGameIdSlotV1RequestBodyHandlerMock.handle,
          ).toHaveBeenCalledWith(requestFixture);
        });

        it('should return an array', () => {
          const expected: [
            apiModels.GameIdSlotCreateQueryV1,
            Game,
            apiModels.UserV1,
          ] = [
            gameIdSlotCreateQueryV1Fixture,
            requestFixture[requestContextProperty].game,
            userFixture,
          ];

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
