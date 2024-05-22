import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';

import { HttpApiResult } from '../../../../common/http/models/HttpApiResult';
import { HttpSpecificResponse } from '../../../../common/http/models/HttpSpecificResponse';
import { Left, Right } from '../../../../common/models/Either';
import { buildResult } from './buildResult';
import { HTTP_BAD_REQUEST_ERROR_MESSAGE } from './unexpectedErrorMessage';

type JoinGameBadRequestResponse = HttpSpecificResponse<
  HttpApiResult<'createGameSlot'>,
  400
>;

type JoinGameOkResponse = HttpSpecificResponse<
  HttpApiResult<'createGameSlot'>,
  200
>;

describe(buildResult.name, () => {
  describe('having a response with status code 200', () => {
    let responseFixture: JoinGameOkResponse;

    beforeAll(() => {
      responseFixture = {
        body: Symbol() as unknown as apiModels.GameSlotV1,
        headers: {},
        statusCode: 200,
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildResult(responseFixture);
      });

      it('should return Right', () => {
        const expected: Right<apiModels.GameSlotV1> = {
          isRight: true,
          value: responseFixture.body,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a response with status code different than 200', () => {
    let responseFixture: JoinGameBadRequestResponse;

    beforeAll(() => {
      responseFixture = {
        body: {
          description: 'sample-description',
        },
        headers: {},
        statusCode: 400,
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildResult(responseFixture);
      });

      it('should return Left', () => {
        const expected: Left<string> = {
          isRight: false,
          value: HTTP_BAD_REQUEST_ERROR_MESSAGE,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});