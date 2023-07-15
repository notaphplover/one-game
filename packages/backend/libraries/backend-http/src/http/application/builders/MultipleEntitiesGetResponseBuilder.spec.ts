import { beforeAll, describe, expect, it } from '@jest/globals';

import httpStatusCodes from 'http-status-codes';

import { ResponseWithBody } from '../models/ResponseWithBody';
import { MultipleEntitiesGetResponseBuilder } from './MultipleEntitiesGetResponseBuilder';

describe(MultipleEntitiesGetResponseBuilder.name, () => {
  let multipleEntitiesGetResponseBuilder: MultipleEntitiesGetResponseBuilder<unknown>;

  beforeAll(() => {
    multipleEntitiesGetResponseBuilder =
      new MultipleEntitiesGetResponseBuilder();
  });

  describe('.build', () => {
    let modelsFixture: unknown[];

    beforeAll(() => {
      modelsFixture = [{ foo: 'bar' }];
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = multipleEntitiesGetResponseBuilder.build(modelsFixture);
      });

      it('should return a ResponseWithBody', () => {
        const expectedResult: ResponseWithBody<unknown> = {
          body: modelsFixture,
          headers: expect.any(Object) as unknown as Record<string, string>,
          statusCode: httpStatusCodes.OK,
        };

        expect(result).toStrictEqual(expectedResult);
      });
    });
  });
});
