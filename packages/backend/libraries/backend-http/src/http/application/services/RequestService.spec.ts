import { beforeAll, describe, expect, it } from '@jest/globals';

import { Left, Right } from '@cornie-js/backend-common';

import { Request } from '../models/Request';
import {
  NumericRequestQueryParseOptions,
  RequestQueryParseFailure,
  RequestQueryParseOptions,
  RequestService,
} from './RequestService';

describe(RequestService.name, () => {
  let requestService: RequestService;

  beforeAll(() => {
    requestService = new RequestService();
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
            value: RequestQueryParseFailure.notFound,
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
            value: RequestQueryParseFailure.invalidValue,
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

        it('should return a Left with the default value', () => {
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

        it('should return a Right with the default value', () => {
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
            value: RequestQueryParseFailure.invalidValue,
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
            value: RequestQueryParseFailure.invalidValue,
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
            value: RequestQueryParseFailure.invalidValue,
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
            value: RequestQueryParseFailure.invalidValue,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
