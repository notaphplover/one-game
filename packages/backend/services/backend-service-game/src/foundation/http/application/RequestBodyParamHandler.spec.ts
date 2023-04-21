import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@one-game-js/api-models';
import { Validator } from '@one-game-js/backend-api-validators';
import { AppError, AppErrorKind } from '@one-game-js/backend-common';
import { RequestWithBody } from '@one-game-js/backend-http';

import { RequestBodyParamHandler } from './RequestBodyParamHandler';

describe(RequestBodyParamHandler.name, () => {
  let validatorMock: jest.Mocked<Validator<apiModels.GameCreateQueryV1>>;

  let requestBodyParamHandler: RequestBodyParamHandler<unknown>;

  beforeAll(() => {
    validatorMock = {
      errors: 'error fixture',
      validate: jest.fn() as unknown as jest.Mocked<
        (data: unknown) => data is apiModels.GameCreateQueryV1
      > &
        ((data: unknown) => data is apiModels.GameCreateQueryV1),
    };

    requestBodyParamHandler = new RequestBodyParamHandler(validatorMock);
  });

  describe('.handle', () => {
    let requestWithBodyFixture: RequestWithBody;

    beforeAll(() => {
      requestWithBodyFixture = {
        body: { [Symbol()]: Symbol() },
      } as Partial<RequestWithBody> as RequestWithBody;
    });

    describe('when called, and validator.validate() returns true', () => {
      let result: unknown;

      beforeAll(async () => {
        validatorMock.validate.mockReturnValueOnce(true);

        result = await requestBodyParamHandler.handle(requestWithBodyFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call validator.validate()', () => {
        expect(validatorMock.validate).toHaveBeenCalledTimes(1);
        expect(validatorMock.validate).toHaveBeenCalledWith(
          requestWithBodyFixture.body,
        );
      });

      it('should return a [GameCreateQuery]', () => {
        expect(result).toStrictEqual([requestWithBodyFixture.body]);
      });
    });

    describe('when called, and validator.validate() returns false', () => {
      let result: unknown;

      beforeAll(async () => {
        validatorMock.validate.mockReturnValueOnce(false);

        try {
          await requestBodyParamHandler.handle(requestWithBodyFixture);
        } catch (error) {
          result = error;
        }
      });

      it('should call validator.validate()', () => {
        expect(validatorMock.validate).toHaveBeenCalledTimes(1);
        expect(validatorMock.validate).toHaveBeenCalledWith(
          requestWithBodyFixture.body,
        );
      });

      it('should throw an Error()', () => {
        const expectedProperties: Partial<AppError> = {
          kind: AppErrorKind.contractViolation,
          message: JSON.stringify({
            description: validatorMock.errors,
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
