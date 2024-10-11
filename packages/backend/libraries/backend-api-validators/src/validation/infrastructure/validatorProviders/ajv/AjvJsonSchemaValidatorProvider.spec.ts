import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('ajv/dist/2020');
jest.mock('ajv-formats');

import {
  JsonRootSchema202012,
  JsonRootSchema202012Object,
} from '@cornie-js/json-schema-utils';
import Ajv, { ErrorObject, ValidateFunction } from 'ajv/dist/2020';

import { Validator } from '../../../../common/application/modules/Validator';
import { AjvJsonSchemaValidatorProvider } from './AjvJsonSchemaValidatorProvider';

describe(AjvJsonSchemaValidatorProvider.name, () => {
  let ajvMock: jest.Mocked<Ajv>;

  beforeAll(() => {
    ajvMock = {
      addSchema: jest.fn().mockReturnThis(),
      compile: jest.fn(),
    } as Partial<jest.Mocked<Ajv>> as jest.Mocked<Ajv>;

    (Ajv as unknown as jest.Mock<() => Ajv>).mockReturnValue(ajvMock);
  });

  describe('.initialize', () => {
    describe('having a jsonSchema array with a boolean jsonSchema', () => {
      let schemaFixture: JsonRootSchema202012;

      let schemasFixture: JsonRootSchema202012[];

      beforeAll(() => {
        schemaFixture = true;

        schemasFixture = [schemaFixture];
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          const ajvJsonSchemaValidatorProvider: AjvJsonSchemaValidatorProvider =
            new AjvJsonSchemaValidatorProvider(async () => schemasFixture);

          try {
            await ajvJsonSchemaValidatorProvider.initialize();
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an Error', () => {
          const expectedError: Partial<Error> = {
            message: `Unexpected boolean JsonSchema`,
          };

          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(expect.objectContaining(expectedError));
        });
      });
    });

    describe('having a jsonSchema array with a jsonSchema with no id', () => {
      let schemaFixture: JsonRootSchema202012;

      let schemasFixture: JsonRootSchema202012[];

      beforeAll(() => {
        schemaFixture = {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
        };

        schemasFixture = [schemaFixture];
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          const ajvJsonSchemaValidatorProvider: AjvJsonSchemaValidatorProvider =
            new AjvJsonSchemaValidatorProvider(async () => schemasFixture);

          try {
            await ajvJsonSchemaValidatorProvider.initialize();
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an Error', () => {
          const expectedError: Partial<Error> = {
            message: expect.stringContaining(
              `Unexpected JsonSchema object without $id`,
            ) as unknown as string,
          };

          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(expect.objectContaining(expectedError));
        });
      });
    });

    describe('when called', () => {
      let schemaFixture: JsonRootSchema202012Object;
      let jsonSchemaValidatorMock: jest.Mock<ValidateFunction<unknown>> &
        ValidateFunction<unknown>;

      let ajvJsonSchemaValidatorProvider: AjvJsonSchemaValidatorProvider;

      beforeAll(async () => {
        schemaFixture = {
          $id: 'http://some-schema-id-host/schema/id',
          $schema: 'https://json-schema.org/draft/2020-12/schema',
        };

        jsonSchemaValidatorMock = jest.fn() as jest.Mock<
          ValidateFunction<unknown>
        > &
          ValidateFunction<unknown>;

        ajvMock.compile.mockReturnValueOnce(jsonSchemaValidatorMock);

        ajvJsonSchemaValidatorProvider = new AjvJsonSchemaValidatorProvider(
          async () => [schemaFixture],
        );

        await ajvJsonSchemaValidatorProvider.initialize();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call ajvInstance.addSchema()', () => {
        expect(ajvMock.addSchema).toHaveBeenCalledTimes(1);
        expect(ajvMock.addSchema).toHaveBeenCalledWith(
          schemaFixture,
          schemaFixture.$id,
        );
      });

      it('should call ajvInstance.compile()', () => {
        expect(ajvMock.compile).toHaveBeenCalledTimes(1);
        expect(ajvMock.compile).toHaveBeenCalledWith(schemaFixture);
      });
    });

    describe('when called twice', () => {
      let ajvJsonSchemaValidatorProvider: AjvJsonSchemaValidatorProvider;

      let result: unknown;

      beforeAll(async () => {
        ajvJsonSchemaValidatorProvider = new AjvJsonSchemaValidatorProvider(
          async () => [],
        );

        await ajvJsonSchemaValidatorProvider.initialize();

        try {
          await ajvJsonSchemaValidatorProvider.initialize();
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should throw an Error', () => {
        const expectedError: Partial<Error> = {
          message: 'Initialize was already called!',
        };

        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(expect.objectContaining(expectedError));
      });
    });
  });

  describe('.provide', () => {
    describe('when called .initialize()', () => {
      let schemaFixture: JsonRootSchema202012Object;
      let jsonSchemaValidatorMock: jest.Mock<ValidateFunction<unknown>> &
        ValidateFunction<unknown>;

      let jsonSchemaValidatorMockErrors: [ErrorObject, ErrorObject];

      let ajvJsonSchemaValidatorProvider: AjvJsonSchemaValidatorProvider;

      beforeAll(async () => {
        schemaFixture = {
          $id: 'http://some-schema-id-host/schema/id',
          $schema: 'https://json-schema.org/draft/2020-12/schema',
        };

        jsonSchemaValidatorMock = jest.fn() as jest.Mock<
          ValidateFunction<unknown>
        > &
          ValidateFunction<unknown>;

        jsonSchemaValidatorMockErrors = [
          {
            instancePath: '',
            keyword: '',
            message: 'sample error message 1',
            params: {},
            schemaPath: '',
          },
          {
            instancePath: '',
            keyword: '',
            message: 'sample error message 2',
            params: {},
            schemaPath: '',
          },
        ];

        jsonSchemaValidatorMock.errors = jsonSchemaValidatorMockErrors;

        ajvMock.compile.mockReturnValueOnce(jsonSchemaValidatorMock);

        ajvJsonSchemaValidatorProvider = new AjvJsonSchemaValidatorProvider(
          async () => [schemaFixture],
        );

        await ajvJsonSchemaValidatorProvider.initialize();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call ajvInstance.addSchema()', () => {
        expect(ajvMock.addSchema).toHaveBeenCalledTimes(1);
        expect(ajvMock.addSchema).toHaveBeenCalledWith(
          schemaFixture,
          schemaFixture.$id,
        );
      });

      it('should call ajvInstance.compile()', () => {
        expect(ajvMock.compile).toHaveBeenCalledTimes(1);
        expect(ajvMock.compile).toHaveBeenCalledWith(schemaFixture);
      });

      describe('when called with an existing id', () => {
        let validator: Validator<unknown>;
        let result: unknown;

        beforeAll(() => {
          validator = ajvJsonSchemaValidatorProvider.provide(
            schemaFixture.$id as string,
          );

          result = validator;
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a validator', () => {
          const expectedValidator: Validator<unknown> = {
            validate: expect.any(Function) as unknown as (
              data: unknown,
            ) => data is unknown,
          };

          expect(result).toStrictEqual(expectedValidator);
        });

        describe('when called validator.validate() and validation fails', () => {
          let result: unknown;

          beforeAll(() => {
            jsonSchemaValidatorMock.mockReturnValueOnce(false);

            result = validator.validate({});
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should return true', () => {
            expect(result).toBe(false);
          });

          it('should contain no errors', () => {
            const expectedValidator: Validator<unknown> = {
              errors: `${jsonSchemaValidatorMockErrors[0].message as string}\n${
                jsonSchemaValidatorMockErrors[1].message as string
              }`,
              validate: expect.any(Function) as unknown as (
                data: unknown,
              ) => data is unknown,
            };

            expect(validator).toStrictEqual(expectedValidator);
          });
        });

        describe('when called validator.validate() and validation succeeds', () => {
          let result: unknown;

          beforeAll(() => {
            jsonSchemaValidatorMock.mockReturnValueOnce(true);

            result = validator.validate({});
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should return true', () => {
            expect(result).toBe(true);
          });

          it('should contain no errors', () => {
            const expectedValidator: Validator<unknown> = {
              errors: null,
              validate: expect.any(Function) as unknown as (
                data: unknown,
              ) => data is unknown,
            };

            expect(validator).toStrictEqual(expectedValidator);
          });
        });
      });

      describe('when called with an unexisting id', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            ajvJsonSchemaValidatorProvider.provide('unexisting-id');
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an Error', () => {
          const expectedError: Partial<Error> = {
            message: expect.stringContaining(
              'No validator found for id',
            ) as unknown as string,
          };

          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(expect.objectContaining(expectedError));
        });
      });
    });
  });
});
