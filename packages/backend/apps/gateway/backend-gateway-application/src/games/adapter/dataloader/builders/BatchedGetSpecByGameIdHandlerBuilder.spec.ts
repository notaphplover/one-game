import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../handlers/BatchedGetSpecByGameIdHandler');

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';

import { BatchedGetSpecByGameIdHandler } from '../handlers/BatchedGetSpecByGameIdHandler';
import { BatchedGetSpecByGameIdHandlerBuilder } from './BatchedGetSpecByGameIdHandlerBuilder';

describe(BatchedGetSpecByGameIdHandlerBuilder.name, () => {
  let gameSpecGraphqlFromGameSpecV1BuilderFixture: Builder<
    graphqlModels.GameSpec,
    [apiModels.GameSpecV1]
  >;
  let httpClientFixture: HttpClient;

  let batchedGetSpecByGameIdHandlerBuilder: BatchedGetSpecByGameIdHandlerBuilder;

  beforeAll(() => {
    gameSpecGraphqlFromGameSpecV1BuilderFixture =
      Symbol() as unknown as Builder<
        graphqlModels.GameSpec,
        [apiModels.GameSpecV1]
      >;

    httpClientFixture = Symbol() as unknown as HttpClient;

    batchedGetSpecByGameIdHandlerBuilder =
      new BatchedGetSpecByGameIdHandlerBuilder(
        gameSpecGraphqlFromGameSpecV1BuilderFixture,
        httpClientFixture,
      );
  });

  describe('.build', () => {
    let requestFixture: Request;

    beforeAll(() => {
      requestFixture = Symbol() as unknown as Request;
    });

    describe('when called', () => {
      let isBatchedGetSpecByGameIdHandlerFixtureProperty: symbol;

      let result: unknown;

      beforeAll(() => {
        isBatchedGetSpecByGameIdHandlerFixtureProperty = Symbol();

        (BatchedGetSpecByGameIdHandler as jest.Mock).mockImplementationOnce(
          function (this: Record<string | symbol, unknown>) {
            this[isBatchedGetSpecByGameIdHandlerFixtureProperty] = true;
          },
        );

        result = batchedGetSpecByGameIdHandlerBuilder.build(requestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call new BatchedGetSpecByGameIdHandler()', () => {
        expect(BatchedGetSpecByGameIdHandler).toHaveBeenCalledTimes(1);
        expect(BatchedGetSpecByGameIdHandler).toHaveBeenCalledWith(
          gameSpecGraphqlFromGameSpecV1BuilderFixture,
          httpClientFixture,
          requestFixture,
        );
      });

      it('should return BatchedGetSpecByGameIdHandler', () => {
        const expectedProperties: Record<string | symbol, unknown> = {
          [isBatchedGetSpecByGameIdHandlerFixtureProperty]: true,
        };

        expect(result).toStrictEqual(
          expect.objectContaining(expectedProperties),
        );
      });
    });
  });
});
