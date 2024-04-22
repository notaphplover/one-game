import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { buildResult } from './buildResult';
import { HttpApiResult } from '../../../../common/http/models/HttpApiResult';
import { Left, Right } from '../../../../common/models/Either';
import { HTTP_BAD_REQUEST_ERROR_MESSAGE } from './unexpectedErrorMessage';
import { HttpSpecificResponse } from '../../../../common/http/models/HttpSpecificResponse';

type CreateGameBadRequestResponse = HttpSpecificResponse<
  HttpApiResult<'createGame'>,
  400
>;

type CreateGameOkResponse = HttpSpecificResponse<
  HttpApiResult<'createGame'>,
  200
>;

describe(buildResult.name, () => {
  describe('having a response with status code 200', () => {
    let responseFixture: CreateGameOkResponse;

    beforeAll(() => {
      responseFixture = {
        body: Symbol() as unknown as apiModels.NonStartedGameV1,
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
        const expected: Right<apiModels.NonStartedGameV1> = {
          isRight: true,
          value: responseFixture.body,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a response with status code different than 200', () => {
    let responseFixture: CreateGameBadRequestResponse;

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
