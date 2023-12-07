import { Either, Left } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Request } from '../models/Request';

export interface RequestQueryParseFailure {
  errors: string[];
  kind: RequestQueryParseFailureKind;
}

export enum RequestQueryParseFailureKind {
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

@Injectable()
export class RequestService {
  public composeErrorMessages(
    resultsAndParams: [Either<RequestQueryParseFailure, unknown>, string][],
  ): string[] {
    return resultsAndParams
      .filter(
        (
          resultAndParam: [Either<RequestQueryParseFailure, unknown>, string],
        ): resultAndParam is [Left<RequestQueryParseFailure>, string] =>
          !resultAndParam[0].isRight,
      )
      .map(
        ([failure, param]: [
          Left<RequestQueryParseFailure>,
          string,
        ]): string[] =>
          failure.value.errors.map(
            (error: string): string => `[${param}]: ${error}`,
          ),
      )
      .flat();
  }

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
    return this.#tryParseNumericQuery(
      request,
      options,
      this.#buildIntegerConstraintsWithErrors(options),
    );
  }

  public tryParseNumericQuery<TMultiple extends boolean>(
    request: Request,
    options: NumericRequestQueryParseOptions<TMultiple>,
  ): Either<RequestQueryParseFailure, ParsedValue<number, TMultiple>> {
    return this.#tryParseNumericQuery(
      request,
      options,
      this.#buildNumericConstraintsWithErrors(options),
    );
  }

  #buildNumericConstraintsWithErrors(
    options: NumericRequestQueryParseOptions,
  ): [(value: number) => boolean, string][] {
    const constraints: [(value: number) => boolean, string][] = [];

    if (options.max !== undefined) {
      constraints.push([
        (value: number): boolean => value <= (options.max as number),
        `Expected value to be less or equal ${options.max}`,
      ]);
    }

    if (options.min !== undefined) {
      constraints.push([
        (value: number): boolean => value >= (options.min as number),
        `Expected value to be greater or equal ${options.min}`,
      ]);
    }

    return constraints;
  }

  #buildIntegerConstraintsWithErrors(
    options: NumericRequestQueryParseOptions,
  ): [(value: number) => boolean, string][] {
    return [
      ...this.#buildNumericConstraintsWithErrors(options),
      [
        (value: number): boolean => Number.isInteger(value),
        'Expected value to be integer',
      ],
    ];
  }

  #checkValueConstraint<T>(
    value: T | T[],
    constraint: (value: T) => boolean,
  ): boolean {
    if (Array.isArray(value)) {
      return value.every(constraint);
    } else {
      return constraint(value);
    }
  }

  #extractErrors<T>(
    value: T | T[],
    constraintsWithError: [(value: T) => boolean, string][],
  ): string[] {
    const errors: string[] = [];

    if (Array.isArray(value)) {
      for (const [constraint, error] of constraintsWithError) {
        if (!value.every(constraint)) {
          errors.push(error);
        }
      }
    } else {
      for (const [constraint, error] of constraintsWithError) {
        if (!constraint(value)) {
          errors.push(error);
        }
      }
    }

    return errors;
  }

  #tryParseNumericQuery<TMultiple extends boolean>(
    request: Request,
    options: NumericRequestQueryParseOptions<TMultiple>,
    constraintsWithError: [(value: number) => boolean, string][],
  ): Either<RequestQueryParseFailure, ParsedValue<number, TMultiple>> {
    const result: Either<
      RequestQueryParseFailure,
      ParsedValue<number, TMultiple>
    > = this.#tryParseQuery(request, options, parseFloat);

    if (!result.isRight) {
      return result;
    }

    if (
      !this.#checkValueConstraint(
        result.value,
        (value: number): boolean => !Number.isNaN(value),
      )
    ) {
      return {
        isRight: false,
        value: {
          errors: [
            'Expecting a numeric value, non numeric one was found instead',
          ],
          kind: RequestQueryParseFailureKind.invalidValue,
        },
      };
    }

    const errors: string[] = this.#extractErrors(
      result.value,
      constraintsWithError,
    );

    if (errors.length > 0) {
      return {
        isRight: false,
        value: {
          errors,
          kind: RequestQueryParseFailureKind.invalidValue,
        },
      };
    }

    return result;
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
        value: {
          errors: ['Expected a single value, multiple ones were found'],
          kind: RequestQueryParseFailureKind.invalidValue,
        },
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
      value: {
        errors: ['Expecting value, but none found'],
        kind: RequestQueryParseFailureKind.notFound,
      },
    };
  }
}
