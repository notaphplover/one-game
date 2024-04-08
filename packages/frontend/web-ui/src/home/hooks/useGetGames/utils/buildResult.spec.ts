import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { buildResult } from './buildResult';
import { Response } from '@cornie-js/api-http-client';
import { HttpApiResult } from '../../../../common/http/models/HttpApiResult';
import { Left, Right } from '../../../../common/models/Either';
import { UNEXPECTED_ERROR_MESSAGE } from './unexpectedErrorMesssage';

type SpecificResponse<TResponse, TStatusCode extends number> =
  TResponse extends Response<infer THeaders, infer TBody, TStatusCode>
    ? Response<THeaders, TBody, TStatusCode>
    : never;

type GetGamesMineBadRequestResponse = SpecificResponse<
  HttpApiResult<'getGamesMine'>,
  400
>;

type GetGamesMineOkResponse = SpecificResponse<
  HttpApiResult<'getGamesMine'>,
  200
>;

describe(buildResult.name, () => {
  describe('having a response with status code 200', () => {
    let responseFixture: GetGamesMineOkResponse;

    beforeAll(() => {
      responseFixture = {
        body: Symbol() as unknown as apiModels.GameArrayV1,
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
        const expected: Right<apiModels.GameArrayV1> = {
          isRight: true,
          value: responseFixture.body,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a response with status code different than 200', () => {
    let responseFixture: GetGamesMineBadRequestResponse;

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
          value: UNEXPECTED_ERROR_MESSAGE,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
