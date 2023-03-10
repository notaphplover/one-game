import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { FastifyReply } from 'fastify';

import { Response } from '../../../application/models/Response';
import { ResponseWithBody } from '../../../application/models/ResponseWithBody';
import { FastifyReplyFromResponseBuilder } from './FastifyReplyFromResponseBuilder';

describe(FastifyReplyFromResponseBuilder.name, () => {
  let fastifyReplyFromResponseBuilder: FastifyReplyFromResponseBuilder;

  beforeAll(() => {
    fastifyReplyFromResponseBuilder = new FastifyReplyFromResponseBuilder();
  });

  describe('.build', () => {
    let fastifyReplyMock: jest.Mocked<FastifyReply>;

    beforeAll(() => {
      fastifyReplyMock = {
        headers: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as Partial<jest.Mocked<FastifyReply>> as jest.Mocked<FastifyReply>;
    });

    describe('having a Response', () => {
      let responseFixture: ResponseWithBody<unknown>;

      beforeAll(() => {
        responseFixture = {
          body: 'foo',
          headers: {
            'content-type': 'application/json',
            origin: 'https://sample.origin.org',
          },
          statusCode: 200,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = fastifyReplyFromResponseBuilder.build(
            responseFixture,
            fastifyReplyMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call fastifyReply.headers()', () => {
          expect(fastifyReplyMock.headers).toHaveBeenCalledTimes(1);
          expect(fastifyReplyMock.headers).toHaveBeenCalledWith(
            responseFixture.headers,
          );
        });

        it('should call fastifyReply.status()', () => {
          expect(fastifyReplyMock.status).toHaveBeenCalledTimes(1);
          expect(fastifyReplyMock.status).toHaveBeenCalledWith(
            responseFixture.statusCode,
          );
        });

        it('should call fastifyReply.send()', () => {
          expect(fastifyReplyMock.send).toHaveBeenCalledTimes(1);
          expect(fastifyReplyMock.send).toHaveBeenCalledWith(
            responseFixture.body,
          );
        });

        it('should return fastifyReply', () => {
          expect(result).toBe(fastifyReplyMock);
        });
      });
    });

    describe('having a Response with no body', () => {
      let responseFixture: Response;

      beforeAll(() => {
        responseFixture = {
          headers: {
            'content-type': 'application/json',
            origin: 'https://sample.origin.org',
          },
          statusCode: 200,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = fastifyReplyFromResponseBuilder.build(
            responseFixture,
            fastifyReplyMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call fastifyReply.headers()', () => {
          expect(fastifyReplyMock.headers).toHaveBeenCalledTimes(1);
          expect(fastifyReplyMock.headers).toHaveBeenCalledWith(
            responseFixture.headers,
          );
        });

        it('should call fastifyReply.status()', () => {
          expect(fastifyReplyMock.status).toHaveBeenCalledTimes(1);
          expect(fastifyReplyMock.status).toHaveBeenCalledWith(
            responseFixture.statusCode,
          );
        });

        it('should call fastifyReply.send()', () => {
          expect(fastifyReplyMock.send).toHaveBeenCalledTimes(1);
          expect(fastifyReplyMock.send).toHaveBeenCalledWith();
        });

        it('should return fastifyReply', () => {
          expect(result).toBe(fastifyReplyMock);
        });
      });
    });
  });
});
