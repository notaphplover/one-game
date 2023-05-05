import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { FastifyRequest } from 'fastify';

import { RequestWithBody } from '../../../application/models/RequestWithBody';
import { RequestWithBodyFromFastifyRequestBuilder } from './RequestWithBodyFromFastifyRequestBuilder';

describe(RequestWithBodyFromFastifyRequestBuilder.name, () => {
  let requestWithBodyFromFastifyRequestBuilder: RequestWithBodyFromFastifyRequestBuilder;

  beforeAll(() => {
    requestWithBodyFromFastifyRequestBuilder =
      new RequestWithBodyFromFastifyRequestBuilder();
  });

  describe('.build', () => {
    describe('having a FastifyRequest', () => {
      let fastifyRequestFixture: FastifyRequest;

      beforeAll(() => {
        fastifyRequestFixture = {
          body: {
            fooBody: {},
          },
          headers: {
            'content-type': 'application/json',
            origin: 'https://sample.origin.org',
          },
          params: {
            fooParam: 'barParam',
          },
          query: {
            fooQueryParam: 'barQueryParam',
          },
        } as Partial<FastifyRequest> as FastifyRequest;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestWithBodyFromFastifyRequestBuilder.build(
            fastifyRequestFixture,
          );
        });

        it('should return a RequestWithBody', () => {
          const expected: RequestWithBody = {
            body: {
              ...(fastifyRequestFixture.body as Record<string, unknown>),
            },
            headers: { ...fastifyRequestFixture.headers } as unknown as Record<
              string,
              string
            >,
            query: {
              ...(fastifyRequestFixture.query as Record<
                string,
                string | string[]
              >),
            },
            urlParameters: {
              ...(fastifyRequestFixture.params as Record<string, string>),
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a FastifyRequest with no body', () => {
      let fastifyRequestFixture: FastifyRequest;

      beforeAll(() => {
        fastifyRequestFixture = {
          headers: {
            'content-type': 'application/json',
            origin: 'https://sample.origin.org',
          },
          params: {
            fooParam: 'barParam',
          },
          query: {
            fooQueryParam: 'barQueryParam',
          },
        } as Partial<FastifyRequest> as FastifyRequest;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            requestWithBodyFromFastifyRequestBuilder.build(
              fastifyRequestFixture,
            );
          } catch (error) {
            result = error;
          }
        });

        it('should throw an Error', () => {
          const expectedProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: 'Invalid body. Expecting a body, but none was found',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });
  });
});
