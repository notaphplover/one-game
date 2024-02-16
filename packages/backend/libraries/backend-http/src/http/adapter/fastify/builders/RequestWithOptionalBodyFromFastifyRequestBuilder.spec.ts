import { beforeAll, describe, expect, it } from '@jest/globals';

import { FastifyRequest } from 'fastify';

import { Request } from '../../../application/models/Request';
import { RequestWithBody } from '../../../application/models/RequestWithBody';
import { RequestWithOptionalBodyFromFastifyRequestBuilder } from './RequestWithOptionalBodyFromFastifyRequestBuilder';

describe(RequestWithOptionalBodyFromFastifyRequestBuilder.name, () => {
  let requestWithOptionalBodyFromFastifyRequestBuilder: RequestWithOptionalBodyFromFastifyRequestBuilder;

  beforeAll(() => {
    requestWithOptionalBodyFromFastifyRequestBuilder =
      new RequestWithOptionalBodyFromFastifyRequestBuilder();
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
          result = requestWithOptionalBodyFromFastifyRequestBuilder.build(
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
          result = requestWithOptionalBodyFromFastifyRequestBuilder.build(
            fastifyRequestFixture,
          );
        });

        it('should return a Request', () => {
          const expected: Request = {
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
  });
});
