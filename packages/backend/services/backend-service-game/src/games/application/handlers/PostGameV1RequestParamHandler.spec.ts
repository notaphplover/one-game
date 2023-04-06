import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@one-game-js/api-models';
import {
  ApiJsonSchemasValidationProvider,
  Validator,
} from '@one-game-js/backend-api-validators';
import { AppError, AppErrorKind } from '@one-game-js/backend-common';
import { RequestWithBody } from '@one-game-js/backend-http';

import { PostGameV1RequestParamHandler } from './PostGameV1RequestParamHandler';

describe(PostGameV1RequestParamHandler.name, () => {
  let gameCreateQueryV1ValidatorMock: jest.Mocked<
    Validator<apiModels.GameCreateQueryV1>
  >;
  let apiJsonSchemasValidationProviderMock: jest.Mocked<ApiJsonSchemasValidationProvider>;

  let postGameV1RequestParamHandler: PostGameV1RequestParamHandler;

  beforeAll(() => {
    gameCreateQueryV1ValidatorMock = {
      errors: 'error fixture',
      validate: jest.fn() as unknown as jest.Mocked<
        (data: unknown) => data is apiModels.GameCreateQueryV1
      > &
        ((data: unknown) => data is apiModels.GameCreateQueryV1),
    };
    apiJsonSchemasValidationProviderMock = {
      provide: jest.fn().mockReturnValueOnce(gameCreateQueryV1ValidatorMock),
    } as Partial<
      jest.Mocked<ApiJsonSchemasValidationProvider>
    > as jest.Mocked<ApiJsonSchemasValidationProvider>;

    postGameV1RequestParamHandler = new PostGameV1RequestParamHandler(
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

    describe('when called, and gameCreateQueryV1Validator.validate() returns true', () => {
      let result: unknown;

      beforeAll(async () => {
        gameCreateQueryV1ValidatorMock.validate.mockReturnValueOnce(true);

        result = await postGameV1RequestParamHandler.handle(
          requestWithBodyFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameCreateQueryV1Validator.validate()', () => {
        expect(gameCreateQueryV1ValidatorMock.validate).toHaveBeenCalledTimes(
          1,
        );
        expect(gameCreateQueryV1ValidatorMock.validate).toHaveBeenCalledWith(
          requestWithBodyFixture.body,
        );
      });

      it('should return a [GameCreateQuery]', () => {
        expect(result).toStrictEqual([requestWithBodyFixture.body]);
      });
    });

    describe('when called, and gameCreateQueryV1Validator.validate() returns false', () => {
      let result: unknown;

      beforeAll(async () => {
        gameCreateQueryV1ValidatorMock.validate.mockReturnValueOnce(false);

        try {
          await postGameV1RequestParamHandler.handle(requestWithBodyFixture);
        } catch (error) {
          result = error;
        }
      });

      it('should call gameCreateQueryV1Validator.validate()', () => {
        expect(gameCreateQueryV1ValidatorMock.validate).toHaveBeenCalledTimes(
          1,
        );
        expect(gameCreateQueryV1ValidatorMock.validate).toHaveBeenCalledWith(
          requestWithBodyFixture.body,
        );
      });

      it('should throw an Error()', () => {
        const expectedProperties: Partial<AppError> = {
          kind: AppErrorKind.contractViolation,
          message: JSON.stringify({
            description: gameCreateQueryV1ValidatorMock.errors,
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
