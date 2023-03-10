import { beforeAll, describe, expect, it } from '@jest/globals';

import { FastifyRequest } from 'fastify';

import { Request } from '../../../application/models/Request';
import { RequestFromFastifyRequestBuilder } from './RequestFromFastifyRequestBuilder';

describe(RequestFromFastifyRequestBuilder.name, () => {
  let requestFromFastifyRequestBuilder: RequestFromFastifyRequestBuilder;

  beforeAll(() => {
    requestFromFastifyRequestBuilder = new RequestFromFastifyRequestBuilder();
  });

  describe('.build', () => {
    describe('having a FastifyRequest', () => {
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
          result = requestFromFastifyRequestBuilder.build(
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

    describe('having a FastifyRequest with no params', () => {
      let fastifyRequestFixture: FastifyRequest;

      beforeAll(() => {
        fastifyRequestFixture = {
          headers: {
            'content-type': 'application/json',
            origin: 'https://sample.origin.org',
          },
          query: {
            fooQueryParam: 'barQueryParam',
          },
        } as Partial<FastifyRequest> as FastifyRequest;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestFromFastifyRequestBuilder.build(
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
            urlParameters: {},
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a FastifyRequest with no query', () => {
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
        } as Partial<FastifyRequest> as FastifyRequest;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestFromFastifyRequestBuilder.build(
            fastifyRequestFixture,
          );
        });

        it('should return a Request', () => {
          const expected: Request = {
            headers: { ...fastifyRequestFixture.headers } as unknown as Record<
              string,
              string
            >,
            query: {},
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
