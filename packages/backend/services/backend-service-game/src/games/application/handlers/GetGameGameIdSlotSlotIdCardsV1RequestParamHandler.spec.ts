import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@one-game-js/backend-common';
import { Request, requestContextProperty } from '@one-game-js/backend-http';

import { NonStartedGameFixtures } from '../../domain/fixtures/NonStartedGameFixtures';
import { Game } from '../../domain/models/Game';
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
    describe('having a Request with a stringified number gameSlotId param', () => {
      let gameSlotPositionFixture: number;
      let gameSlotPositionStringifiedFixture: string;
      let gameFixture: Game;
      let requestFixture: Request & GameRequestContextHolder;

      beforeAll(() => {
        gameSlotPositionFixture = 0;
        gameSlotPositionStringifiedFixture = '0';
        gameFixture = NonStartedGameFixtures.any;
        requestFixture = {
          headers: {},
          query: {},
          [requestContextProperty]: {
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
          ]);
        });
      });
    });

    describe('having a Request with a non stringified number gameSlotId param', () => {
      let gameSlotPositionStringifiedFixture: string;
      let gameFixture: Game;
      let requestFixture: Request & GameRequestContextHolder;

      beforeAll(() => {
        gameSlotPositionStringifiedFixture = 'not-a-number';
        gameFixture = NonStartedGameFixtures.any;
        requestFixture = {
          headers: {},
          query: {},
          [requestContextProperty]: {
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
      let gameFixture: Game;
      let requestFixture: Request & GameRequestContextHolder;

      beforeAll(() => {
        gameFixture = NonStartedGameFixtures.any;
        requestFixture = {
          headers: {},
          query: {},
          [requestContextProperty]: {
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
