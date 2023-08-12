import { beforeAll, describe, expect, it } from '@jest/globals';

import httpStatusCodes from 'http-status-codes';

import { Response } from '../models/Response';
import { ResponseWithBody } from '../models/ResponseWithBody';
import { SingleEntityPostResponseBuilder } from './SingleEntityPostResponseBuilder';

describe(SingleEntityPostResponseBuilder.name, () => {
  let singleEntityPostResponseBuilder: SingleEntityPostResponseBuilder<unknown>;

  beforeAll(() => {
    singleEntityPostResponseBuilder = new SingleEntityPostResponseBuilder();
  });

  describe('.build', () => {
    describe('having no modelApi', () => {
      let modelFixture: undefined;

      beforeAll(() => {
        modelFixture = undefined;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = singleEntityPostResponseBuilder.build(modelFixture);
        });

        it('should return a Response', () => {
          const expected: Response = {
            headers: { 'content-type': 'application/json' },
            statusCode: httpStatusCodes.CREATED,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a model', () => {
      let modelFixture: unknown;

      beforeAll(() => {
        modelFixture = Symbol();
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = singleEntityPostResponseBuilder.build(modelFixture);
        });

        it('should return a Response', () => {
          const expected: ResponseWithBody<unknown> = {
            body: modelFixture,
            headers: { 'content-type': 'application/json' },
            statusCode: httpStatusCodes.OK,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
