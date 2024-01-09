import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';

import { GetGamesV1GameIdRequestParamHandler } from './GetGamesV1GameIdRequestParamHandler';

describe(GetGamesV1GameIdRequestParamHandler.name, () => {
  let getGamesV1GameIdRequestParamHandler: GetGamesV1GameIdRequestParamHandler;

  beforeAll(() => {
    getGamesV1GameIdRequestParamHandler =
      new GetGamesV1GameIdRequestParamHandler();
  });

  describe('.handle()', () => {
    describe('having a Request with gameId param', () => {
      let gameIdFixture: string;
      let requestFixture: Request;

      beforeAll(() => {
        gameIdFixture = 'game-id';
        requestFixture = {
          headers: {},
          query: {},
          urlParameters: {
            [GetGamesV1GameIdRequestParamHandler.getGameV1GameIdRequestParam]:
              gameIdFixture,
          },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          result =
            await getGamesV1GameIdRequestParamHandler.handle(requestFixture);
        });

        it('should return a string', () => {
          expect(result).toStrictEqual([gameIdFixture]);
        });
      });
    });

    describe('having a Request without gameId param', () => {
      let requestFixture: Request;

      beforeAll(() => {
        requestFixture = {
          headers: {},
          query: {},
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          try {
            await getGamesV1GameIdRequestParamHandler.handle(requestFixture);
          } catch (error) {
            result = error;
          }
        });

        it('should return a string', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: 'Unexpected error: no game id was found in request params',
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
