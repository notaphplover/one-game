import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';

import { GraphQlErrorFromErrorBuilder } from './GraphQlErrorFromErrorBuilder';

describe(GraphQlErrorFromErrorBuilder.name, () => {
  let httpStatusCodeFromErrorBuilderMock: jest.Mocked<
    Builder<number, [AppError]>
  >;
  let graphQlErrorFromAppErrorBuilder: GraphQlErrorFromErrorBuilder;

  beforeAll(() => {
    httpStatusCodeFromErrorBuilderMock = {
      build: jest.fn(),
    };

    graphQlErrorFromAppErrorBuilder = new GraphQlErrorFromErrorBuilder(
      httpStatusCodeFromErrorBuilderMock,
    );
  });

  describe('.build', () => {
    describe.each<[unknown]>([[undefined], [null], [{}]])(
      'having a non AppError',
      (errorFixture: unknown) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = graphQlErrorFromAppErrorBuilder.build(errorFixture);
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should return a GraphQLError', () => {
            const expectedProperties: Partial<GraphQLError> = {
              extensions: {
                http: {
                  status: HttpStatus.INTERNAL_SERVER_ERROR,
                },
              },
            };

            expect(result).toBeInstanceOf(GraphQLError);
            expect(result).toStrictEqual(
              expect.objectContaining(expectedProperties),
            );
          });
        });
      },
    );

    describe('having an AppError', () => {
      let appErrorFixture: AppError;

      beforeAll(() => {
        appErrorFixture = new AppError(AppErrorKind.contractViolation);
      });

      describe('when called', () => {
        let statusCodeFixture: number;

        let result: unknown;

        beforeAll(() => {
          statusCodeFixture = HttpStatus.ACCEPTED;

          httpStatusCodeFromErrorBuilderMock.build.mockReturnValueOnce(
            statusCodeFixture,
          );

          result = graphQlErrorFromAppErrorBuilder.build(appErrorFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpStatusCodeFromErrorBuilder.build()', () => {
          expect(
            httpStatusCodeFromErrorBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
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
});
