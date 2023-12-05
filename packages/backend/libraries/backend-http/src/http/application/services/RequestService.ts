import { Either, Left } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Request } from '../models/Request';

export enum RequestQueryParseFailure {
  invalidValue,
  notFound,
}

export type ParsedValue<T, TMultiple extends boolean> = TMultiple extends true
  ? T[]
  : TMultiple extends false
    ? T
    : T | T[];

export interface RequestQueryParseOptions<
  TValue,
  TMultiple extends boolean = boolean,
> {
  default?: ParsedValue<TValue, TMultiple>;
  isMultiple?: TMultiple;
  name: string;
}

export interface NumericRequestQueryParseOptions<
  TMultiple extends boolean = boolean,
> extends RequestQueryParseOptions<number, TMultiple> {
  max?: number;
  min?: number;
}

const INVALID_VALUE_RESULT: Left<RequestQueryParseFailure.invalidValue> =
  Object.freeze({
    isRight: false,
    value: RequestQueryParseFailure.invalidValue,
  });

@Injectable()
export class RequestService {
  public tryParseStringQuery<TMultiple extends boolean>(
    request: Request,
    options: RequestQueryParseOptions<string, TMultiple>,
  ): Either<RequestQueryParseFailure, ParsedValue<string, TMultiple>> {
    return this.#tryParseQuery(
      request,
      options,
      (value: string): string => value,
    );
  }

  public tryParseIntegerQuery<TMultiple extends boolean>(
    request: Request,
    options: NumericRequestQueryParseOptions<TMultiple>,
  ): Either<RequestQueryParseFailure, ParsedValue<number, TMultiple>> {
    const result: Either<
      RequestQueryParseFailure,
      ParsedValue<number, TMultiple>
    > = this.tryParseNumericQuery(request, options);

    if (!result.isRight) {
      return result;
    }

    if (!Number.isInteger(result.value)) {
      return INVALID_VALUE_RESULT;
    }

    return result;
  }

  public tryParseNumericQuery<TMultiple extends boolean>(
    request: Request,
    options: NumericRequestQueryParseOptions<TMultiple>,
  ): Either<RequestQueryParseFailure, ParsedValue<number, TMultiple>> {
    const result: Either<
      RequestQueryParseFailure,
      ParsedValue<number, TMultiple>
    > = this.#tryParseQuery(request, options, parseFloat);

    if (!result.isRight) {
      return result;
    }

    if (Number.isNaN(result.value)) {
      return INVALID_VALUE_RESULT;
    }

    if (options.min !== undefined) {
      if (
        !this.#checkNumericValueConstraint(
          result.value,
          (value: number): boolean => value >= (options.min as number),
        )
      ) {
        return INVALID_VALUE_RESULT;
      }
    }

    if (options.max !== undefined) {
      if (
        !this.#checkNumericValueConstraint(
          result.value,
          (value: number): boolean => value <= (options.max as number),
        )
      ) {
        return INVALID_VALUE_RESULT;
      }
    }

    return result;
  }

  #checkNumericValueConstraint(
    value: number | number[],
    constraint: (value: number) => boolean,
  ): boolean {
    if (typeof value === 'number') {
      return constraint(value);
    } else {
      return value.every(constraint);
    }
  }

  #tryParseQuery<T, TMultiple extends boolean>(
    request: Request,
    options: RequestQueryParseOptions<T, TMultiple>,
    cast: (value: string) => T,
  ): Either<RequestQueryParseFailure, ParsedValue<T, TMultiple>> {
    const queryValue: string | string[] | undefined =
      request.query[options.name];

    if (queryValue === undefined) {
      return this.#parseUndefinedValue(options);
    }

    if (typeof queryValue === 'string') {
      return this.#parseSingleQueryValue(queryValue, options, cast);
    } else {
      return this.#parseMultipleQueryValue(queryValue, options, cast);
    }
  }

  #parseMultipleQueryValue<T, TMultiple extends boolean>(
    queryValue: string[],
    options: RequestQueryParseOptions<T, TMultiple>,
    cast: (value: string) => T,
  ): Either<RequestQueryParseFailure, ParsedValue<T, TMultiple>> {
    if (options.isMultiple === false) {
      return {
        isRight: false,
        value: RequestQueryParseFailure.invalidValue,
      };
    } else {
      return {
        isRight: true,
        value: queryValue.map(cast) as ParsedValue<T, TMultiple>,
      };
    }
  }

  #parseSingleQueryValue<T, TMultiple extends boolean>(
    queryValue: string,
    options: RequestQueryParseOptions<T, TMultiple>,
    cast: (value: string) => T,
  ): Either<RequestQueryParseFailure, ParsedValue<T, TMultiple>> {
    if (options.isMultiple === true) {
      return {
        isRight: true,
        value: [cast(queryValue)] as ParsedValue<T, TMultiple>,
      };
    } else {
      return {
        isRight: true,
        value: cast(queryValue) as ParsedValue<T, TMultiple>,
      };
    }
  }

  #parseUndefinedValue<T, TMultiple extends boolean>(
    options: RequestQueryParseOptions<T, TMultiple>,
  ): Either<RequestQueryParseFailure, ParsedValue<T, TMultiple>> {
    if ('default' in options) {
      return {
        isRight: true,
        value: options.default,
      };
    }

    return {
      isRight: false,
      value: RequestQueryParseFailure.notFound,
    };
  }
}
