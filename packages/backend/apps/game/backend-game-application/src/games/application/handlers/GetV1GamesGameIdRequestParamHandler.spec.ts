import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';

import { GetV1GamesGameIdRequestParamHandler } from './GetV1GamesGameIdRequestParamHandler';

describe(GetV1GamesGameIdRequestParamHandler.name, () => {
  let getV1GamesGameIdRequestParamHandler: GetV1GamesGameIdRequestParamHandler;

  beforeAll(() => {
    getV1GamesGameIdRequestParamHandler =
      new GetV1GamesGameIdRequestParamHandler();
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
            [GetV1GamesGameIdRequestParamHandler.getGameV1GameIdRequestParam]:
              gameIdFixture,
          },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          result =
            await getV1GamesGameIdRequestParamHandler.handle(requestFixture);
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
            await getV1GamesGameIdRequestParamHandler.handle(requestFixture);
          } catch (error: unknown) {
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
