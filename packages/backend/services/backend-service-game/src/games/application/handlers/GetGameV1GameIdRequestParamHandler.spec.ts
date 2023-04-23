import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@one-game-js/backend-common';
import { Request } from '@one-game-js/backend-http';

import {
  GetGameV1GameIdRequestParamHandler,
  GET_GAME_V1_GAME_ID_REQUEST_PARAM,
} from './GetGameV1GameIdRequestParamHandler';

describe(GetGameV1GameIdRequestParamHandler.name, () => {
  let getGameV1GameIdRequestParamHandler: GetGameV1GameIdRequestParamHandler;

  beforeAll(() => {
    getGameV1GameIdRequestParamHandler =
      new GetGameV1GameIdRequestParamHandler();
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
          urlParameters: { [GET_GAME_V1_GAME_ID_REQUEST_PARAM]: gameIdFixture },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          result = await getGameV1GameIdRequestParamHandler.handle(
            requestFixture,
          );
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
            await getGameV1GameIdRequestParamHandler.handle(requestFixture);
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
