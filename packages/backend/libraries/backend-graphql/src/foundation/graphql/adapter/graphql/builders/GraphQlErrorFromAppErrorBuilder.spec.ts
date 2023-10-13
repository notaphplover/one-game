import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';

import { GraphQlErrorFromAppErrorBuilder } from './GraphQlErrorFromAppErrorBuilder';

describe(GraphQlErrorFromAppErrorBuilder.name, () => {
  let httpStatusCodeFromErrorBuilderMock: jest.Mocked<
    Builder<number, [AppError]>
  >;
  let graphQlErrorFromAppErrorBuilder: GraphQlErrorFromAppErrorBuilder;

  beforeAll(() => {
    httpStatusCodeFromErrorBuilderMock = {
      build: jest.fn(),
    };

    graphQlErrorFromAppErrorBuilder = new GraphQlErrorFromAppErrorBuilder(
      httpStatusCodeFromErrorBuilderMock,
    );
  });

  describe('.build', () => {
    let appErrorFixture: AppError;
    let statusCodeFixture: number;

    beforeAll(() => {
      appErrorFixture = new AppError(AppErrorKind.contractViolation);
      statusCodeFixture = HttpStatus.ACCEPTED;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        httpStatusCodeFromErrorBuilderMock.build.mockReturnValueOnce(
          statusCodeFixture,
        );

        result = graphQlErrorFromAppErrorBuilder.build(appErrorFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpStatusCodeFromErrorBuilder.build()', () => {
        expect(httpStatusCodeFromErrorBuilderMock.build).toHaveBeenCalledTimes(
          1,
        );
        expect(httpStatusCodeFromErrorBuilderMock.build).toHaveBeenCalledWith(
          appErrorFixture,
        );
      });

      it('should return a GraphQLError', () => {
        const expectedProperties: Partial<GraphQLError> = {
          extensions: {
            code: 'API_ERROR',
            http: {
              status: statusCodeFixture,
            },
          },
          message: appErrorFixture.message,
        };

        expect(result).toBeInstanceOf(GraphQLError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedProperties),
        );
      });
    });
  });
});
