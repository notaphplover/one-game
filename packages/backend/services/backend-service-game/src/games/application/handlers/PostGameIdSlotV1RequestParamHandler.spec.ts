import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@one-game-js/api-models';
import { Handler } from '@one-game-js/backend-common';
import {
  RequestWithBody,
  requestContextProperty,
} from '@one-game-js/backend-http';

import { NonStartedGameFixtures } from '../../domain/fixtures/NonStartedGameFixtures';
import { Game } from '../../domain/models/Game';
import { GameSlotCreateV1Fixtures } from '../fixtures/GameSlotCreateV1Fixtures';
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
    let requestFixture: RequestWithBody & GameRequestContextHolder;

    describe('when called', () => {
      let gameIdSlotCreateQueryV1Fixture: apiModels.GameIdSlotCreateQueryV1;

      let result: unknown;

      beforeAll(async () => {
        requestFixture = {
          [requestContextProperty]: {
            game: NonStartedGameFixtures.any,
          },
        } as Partial<
          RequestWithBody & GameRequestContextHolder
        > as RequestWithBody & GameRequestContextHolder;

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
        const expected: [apiModels.GameIdSlotCreateQueryV1, Game] = [
          gameIdSlotCreateQueryV1Fixture,
          requestFixture[requestContextProperty].game,
        ];

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
