import { beforeAll, describe, expect, it } from '@jest/globals';

import { Left, Right } from '@cornie-js/backend-common';

import { Request } from '../models/Request';
import {
  NumericRequestQueryParseOptions,
  RequestQueryParseFailure,
  RequestQueryParseFailureKind,
  RequestQueryParseOptions,
  RequestService,
} from './RequestService';

describe(RequestService.name, () => {
  let requestService: RequestService;

  beforeAll(() => {
    requestService = new RequestService();
  });

  describe('.tryParseBooleanQuery', () => {
    describe('having a Request with no query value and options with default value', () => {
      let requestQueryParseOptionsFixture: RequestQueryParseOptions<boolean>;
      let requestFixture: Request;

      beforeAll(() => {
        requestQueryParseOptionsFixture = {
          default: true,
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {},
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseBooleanQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Right with the default value', () => {
          const expected: Right<boolean | boolean[]> = {
            isRight: true,
            value: requestQueryParseOptionsFixture.default as
              | boolean
              | boolean[],
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with no query value and options with no default value', () => {
      let requestQueryParseOptionsFixture: RequestQueryParseOptions<boolean>;
      let requestFixture: Request;

      beforeAll(() => {
        requestQueryParseOptionsFixture = {
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {},
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseBooleanQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Left with the default value', () => {
          const expected: Left<RequestQueryParseFailure> = {
            isRight: false,
            value: {
              errors: ['Expecting value, but none found'],
              kind: RequestQueryParseFailureKind.notFound,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with "true" single query value', () => {
      let queryValueFixture: string | string[];
      let requestQueryParseOptionsFixture: RequestQueryParseOptions<boolean>;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = 'true';
        requestQueryParseOptionsFixture = {
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseBooleanQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Right with the parsed value', () => {
          const expected: Right<boolean | boolean[]> = {
            isRight: true,
            value: true,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with "false" single query value', () => {
      let queryValueFixture: string | string[];
      let requestQueryParseOptionsFixture: RequestQueryParseOptions<boolean>;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = 'false';
        requestQueryParseOptionsFixture = {
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseBooleanQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Right with the parsed value', () => {
          const expected: Right<boolean | boolean[]> = {
            isRight: true,
            value: false,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with invalid single query value', () => {
      let queryValueFixture: string | string[];
      let requestQueryParseOptionsFixture: RequestQueryParseOptions<boolean>;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = 'invalid-boolean-fixture';
        requestQueryParseOptionsFixture = {
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseBooleanQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Left with errors', () => {
          const expected: Left<RequestQueryParseFailure> = {
            isRight: false,
            value: {
              errors: ['Expected "true" or "false" boolean values'],
              kind: RequestQueryParseFailureKind.invalidValue,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with multiple value and options with isMultiple false', () => {
      let queryValueFixture: string | string[];
      let requestQueryParseOptionsFixture: RequestQueryParseOptions<boolean>;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = ['true'];
        requestQueryParseOptionsFixture = {
          isMultiple: false,
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseBooleanQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Left with the default value', () => {
          const expected: Left<RequestQueryParseFailure> = {
            isRight: false,
            value: {
              errors: ['Expected a single value, multiple ones were found'],
              kind: RequestQueryParseFailureKind.invalidValue,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with single value and options with isMultiple true', () => {
      let queryValueFixture: string;
      let requestQueryParseOptionsFixture: RequestQueryParseOptions<boolean>;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = 'true';
        requestQueryParseOptionsFixture = {
          isMultiple: true,
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseBooleanQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Right with the parsed value', () => {
          const expected: Right<boolean | boolean[]> = {
            isRight: true,
            value: [true],
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with multiple query value', () => {
      let queryValueFixture: string | string[];
      let requestQueryParseOptionsFixture: RequestQueryParseOptions<boolean>;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = ['true'];
        requestQueryParseOptionsFixture = {
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseBooleanQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Right with the parsed value', () => {
          const expected: Right<boolean | boolean[]> = {
            isRight: true,
            value: [true],
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });

  describe('.tryParseStringQuery', () => {
    describe('having a Request with no query value and options with default value', () => {
      let requestQueryParseOptionsFixture: RequestQueryParseOptions<string>;
      let requestFixture: Request;

      beforeAll(() => {
        requestQueryParseOptionsFixture = {
          default: 'bar',
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {},
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseStringQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Right with the default value', () => {
          const expected: Right<string | string[]> = {
            isRight: true,
            value: requestQueryParseOptionsFixture.default as string | string[],
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with no query value and options with no default value', () => {
      let requestQueryParseOptionsFixture: RequestQueryParseOptions<string>;
      let requestFixture: Request;

      beforeAll(() => {
        requestQueryParseOptionsFixture = {
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {},
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseStringQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Left with the default value', () => {
          const expected: Left<RequestQueryParseFailure> = {
            isRight: false,
            value: {
              errors: ['Expecting value, but none found'],
              kind: RequestQueryParseFailureKind.notFound,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with single query value', () => {
      let queryValueFixture: string | string[];
      let requestQueryParseOptionsFixture: RequestQueryParseOptions<string>;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = 'bar';
        requestQueryParseOptionsFixture = {
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseStringQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Right with the default value', () => {
          const expected: Right<string | string[]> = {
            isRight: true,
            value: queryValueFixture,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with multiple value and options with isMultiple false', () => {
      let queryValueFixture: string | string[];
      let requestQueryParseOptionsFixture: RequestQueryParseOptions<string>;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = ['bar'];
        requestQueryParseOptionsFixture = {
          isMultiple: false,
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseStringQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Left with the default value', () => {
          const expected: Left<RequestQueryParseFailure> = {
            isRight: false,
            value: {
              errors: ['Expected a single value, multiple ones were found'],
              kind: RequestQueryParseFailureKind.invalidValue,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with single value and options with isMultiple true', () => {
      let queryValueFixture: string;
      let requestQueryParseOptionsFixture: RequestQueryParseOptions<string>;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = 'bar';
        requestQueryParseOptionsFixture = {
          isMultiple: true,
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseStringQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Right with the parsed value', () => {
          const expected: Right<string[]> = {
            isRight: true,
            value: [queryValueFixture],
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with multiple query value', () => {
      let queryValueFixture: string | string[];
      let requestQueryParseOptionsFixture: RequestQueryParseOptions<string>;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = ['bar'];
        requestQueryParseOptionsFixture = {
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseStringQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Right with the parsed value', () => {
          const expected: Right<string | string[]> = {
            isRight: true,
            value: queryValueFixture,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });

  describe('.tryParseNumericQuery', () => {
    describe('having a Request with non numeric query value', () => {
      let queryValueFixture: string | string[];
      let requestQueryParseOptionsFixture: NumericRequestQueryParseOptions;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = 'bar';

        requestQueryParseOptionsFixture = {
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseNumericQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Left with invalid value', () => {
          const expected: Left<RequestQueryParseFailure> = {
            isRight: false,
            value: {
              errors: [
                'Expecting a numeric value, non numeric one was found instead',
              ],
              kind: RequestQueryParseFailureKind.invalidValue,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with numeric query value', () => {
      let queryValueFixture: string;
      let requestQueryParseOptionsFixture: NumericRequestQueryParseOptions;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = '3';

        requestQueryParseOptionsFixture = {
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseNumericQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Right with parsed value', () => {
          const expected: Right<number> = {
            isRight: true,
            value: parseFloat(queryValueFixture),
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with numeric query value greater than options max value', () => {
      let queryValueFixture: string;
      let requestQueryParseOptionsFixture: NumericRequestQueryParseOptions;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = '3';

        requestQueryParseOptionsFixture = {
          max: 1,
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseNumericQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Left with invalid value', () => {
          const expected: Left<RequestQueryParseFailure> = {
            isRight: false,
            value: {
              errors: [
                `Expected value to be less or equal ${(requestQueryParseOptionsFixture.max as number).toString()}`,
              ],
              kind: RequestQueryParseFailureKind.invalidValue,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with numeric query value less than options min value', () => {
      let queryValueFixture: string;
      let requestQueryParseOptionsFixture: NumericRequestQueryParseOptions;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = '0';

        requestQueryParseOptionsFixture = {
          min: 1,
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseNumericQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Left with invalid value', () => {
          const expected: Left<RequestQueryParseFailure> = {
            isRight: false,
            value: {
              errors: [
                `Expected value to be greater or equal ${(requestQueryParseOptionsFixture.min as number).toString()}`,
              ],
              kind: RequestQueryParseFailureKind.invalidValue,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });

  describe('.tryParseIntegerQuery', () => {
    describe('having a Request with integer query value', () => {
      let queryValueFixture: string;
      let requestQueryParseOptionsFixture: NumericRequestQueryParseOptions;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = '3';

        requestQueryParseOptionsFixture = {
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseIntegerQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Right with parsed value', () => {
          const expected: Right<number> = {
            isRight: true,
            value: parseFloat(queryValueFixture),
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a Request with decimal query value', () => {
      let queryValueFixture: string;
      let requestQueryParseOptionsFixture: NumericRequestQueryParseOptions;
      let requestFixture: Request;

      beforeAll(() => {
        queryValueFixture = '0.1';

        requestQueryParseOptionsFixture = {
          name: 'foo',
        };

        requestFixture = {
          headers: {},
          query: {
            [requestQueryParseOptionsFixture.name]: queryValueFixture,
          },
          urlParameters: {},
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = requestService.tryParseIntegerQuery(
            requestFixture,
            requestQueryParseOptionsFixture,
          );
        });

        it('should return a Left with invalid value', () => {
          const expected: Left<RequestQueryParseFailure> = {
            isRight: false,
            value: {
              errors: ['Expected value to be integer'],
              kind: RequestQueryParseFailureKind.invalidValue,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
