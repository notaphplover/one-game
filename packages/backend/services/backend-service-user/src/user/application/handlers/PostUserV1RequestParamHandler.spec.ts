import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@one-game-js/api-models';
import {
  ApiJsonSchemasValidationProvider,
  Validator,
} from '@one-game-js/backend-api-validators';
import { AppError, AppErrorKind } from '@one-game-js/backend-common';
import { RequestWithBody } from '@one-game-js/backend-http';

import { PostUserV1RequestParamHandler } from './PostUserV1RequestParamHandler';

describe(PostUserV1RequestParamHandler.name, () => {
  let userCreateQueryV1ValidatorMock: jest.Mocked<
    Validator<apiModels.UserCreateQueryV1>
  >;
  let apiJsonSchemasValidationProviderMock: jest.Mocked<ApiJsonSchemasValidationProvider>;

  let postUserV1RequestParamHandler: PostUserV1RequestParamHandler;

  beforeAll(() => {
    userCreateQueryV1ValidatorMock = {
      errors: 'error fixture',
      validate: jest.fn() as unknown as jest.Mocked<
        (data: unknown) => data is apiModels.UserCreateQueryV1
      > &
        ((data: unknown) => data is apiModels.UserCreateQueryV1),
    };
    apiJsonSchemasValidationProviderMock = {
      provide: jest.fn().mockReturnValueOnce(userCreateQueryV1ValidatorMock),
    } as Partial<
      jest.Mocked<ApiJsonSchemasValidationProvider>
    > as jest.Mocked<ApiJsonSchemasValidationProvider>;

    postUserV1RequestParamHandler = new PostUserV1RequestParamHandler(
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

    describe('when called, and userCreateQueryV1Validator.validate() returns true', () => {
      let result: unknown;

      beforeAll(async () => {
        userCreateQueryV1ValidatorMock.validate.mockReturnValueOnce(true);

        result = await postUserV1RequestParamHandler.handle(
          requestWithBodyFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userCreateQueryV1Validator.validate()', () => {
        expect(userCreateQueryV1ValidatorMock.validate).toHaveBeenCalledTimes(
          1,
        );
        expect(userCreateQueryV1ValidatorMock.validate).toHaveBeenCalledWith(
          requestWithBodyFixture.body,
        );
      });

      it('should return a [UserCreateQuery]', () => {
        expect(result).toStrictEqual([requestWithBodyFixture.body]);
      });
    });

    describe('when called, and userCreateQueryV1Validator.validate() returns false', () => {
      let result: unknown;

      beforeAll(async () => {
        userCreateQueryV1ValidatorMock.validate.mockReturnValueOnce(false);

        try {
          await postUserV1RequestParamHandler.handle(requestWithBodyFixture);
        } catch (error) {
          result = error;
        }
      });

      it('should call userCreateQueryV1Validator.validate()', () => {
        expect(userCreateQueryV1ValidatorMock.validate).toHaveBeenCalledTimes(
          1,
        );
        expect(userCreateQueryV1ValidatorMock.validate).toHaveBeenCalledWith(
          requestWithBodyFixture.body,
        );
      });

      it('should throw an Error()', () => {
        const expectedProperties: Partial<AppError> = {
          kind: AppErrorKind.contractViolation,
          message: JSON.stringify({
            description: userCreateQueryV1ValidatorMock.errors,
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
