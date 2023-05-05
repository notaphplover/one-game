import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import {
  ApiJsonSchemasValidationProvider,
  Validator,
} from '@cornie-js/backend-api-validators';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { RequestWithBody } from '@cornie-js/backend-http';

import { PostAuthV1RequestParamHandler } from './PostAuthV1RequestParamHandler';

describe(PostAuthV1RequestParamHandler.name, () => {
  let authCreateQueryV1ValidatorMock: jest.Mocked<
    Validator<apiModels.AuthCreateQueryV1>
  >;
  let apiJsonSchemasValidationProviderMock: jest.Mocked<ApiJsonSchemasValidationProvider>;

  let postAuthV1RequestParamHandler: PostAuthV1RequestParamHandler;

  beforeAll(() => {
    authCreateQueryV1ValidatorMock = {
      errors: 'error fixture',
      validate: jest.fn() as unknown as jest.Mocked<
        (data: unknown) => data is apiModels.AuthCreateQueryV1
      > &
        ((data: unknown) => data is apiModels.AuthCreateQueryV1),
    };
    apiJsonSchemasValidationProviderMock = {
      provide: jest.fn().mockReturnValueOnce(authCreateQueryV1ValidatorMock),
    } as Partial<
      jest.Mocked<ApiJsonSchemasValidationProvider>
    > as jest.Mocked<ApiJsonSchemasValidationProvider>;

    postAuthV1RequestParamHandler = new PostAuthV1RequestParamHandler(
      apiJsonSchemasValidationProviderMock,
    );
  });

  describe('.handle', () => {
    let requestWithBodyFixture: RequestWithBody;

    beforeAll(() => {
      requestWithBodyFixture = {
        body: { [Symbol()]: Symbol() },
      } as Partial<RequestWithBody> as RequestWithBody;
    });

    describe('when called, and authCreateQueryV1Validator.validate() returns true', () => {
      let result: unknown;

      beforeAll(async () => {
        authCreateQueryV1ValidatorMock.validate.mockReturnValueOnce(true);

        result = await postAuthV1RequestParamHandler.handle(
          requestWithBodyFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call authCreateQueryV1Validator.validate()', () => {
        expect(authCreateQueryV1ValidatorMock.validate).toHaveBeenCalledTimes(
          1,
        );
        expect(authCreateQueryV1ValidatorMock.validate).toHaveBeenCalledWith(
          requestWithBodyFixture.body,
        );
      });

      it('should return a [AuthCreateQuery]', () => {
        expect(result).toStrictEqual([requestWithBodyFixture.body]);
      });
    });

    describe('when called, and authCreateQueryV1Validator.validate() returns false', () => {
      let result: unknown;

      beforeAll(async () => {
        authCreateQueryV1ValidatorMock.validate.mockReturnValueOnce(false);

        try {
          await postAuthV1RequestParamHandler.handle(requestWithBodyFixture);
        } catch (error) {
          result = error;
        }
      });

      it('should call authCreateQueryV1Validator.validate()', () => {
        expect(authCreateQueryV1ValidatorMock.validate).toHaveBeenCalledTimes(
          1,
        );
        expect(authCreateQueryV1ValidatorMock.validate).toHaveBeenCalledWith(
          requestWithBodyFixture.body,
        );
      });

      it('should throw an Error()', () => {
        const expectedProperties: Partial<AppError> = {
          kind: AppErrorKind.contractViolation,
          message: JSON.stringify({
            description: authCreateQueryV1ValidatorMock.errors,
          }),
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedProperties),
        );
      });
    });
  });
});
