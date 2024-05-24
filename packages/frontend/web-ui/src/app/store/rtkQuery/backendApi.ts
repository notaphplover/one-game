import { models as apiModels } from '@cornie-js/api-models';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  BAD_REQUEST,
  OK,
  UNAUTHORIZED,
} from '../../../common/http/helpers/httpCodes';
import { AuthResponse } from '../../../common/http/models/AuthResponse';
import { httpClient } from '../../../common/http/services/HttpService';

export enum AppErrorKind {
  contractViolation = 'contractViolation',
  entityConflict = 'entityConflict',
  entityNotFound = 'entityNotFound',
  invalidCredentials = 'invalidCredentials',
  missingCredentials = 'missingCredentials',
  unknown = 'unknown',
  unprocessableOperation = 'unprocessableOperation',
}

export const isAppErrorSymbol: unique symbol = Symbol.for('isAppError');

export class AppError extends Error {
  public [isAppErrorSymbol]: true;

  public kind: AppErrorKind;

  constructor(kind: AppErrorKind, message?: string, options?: ErrorOptions) {
    super(message, options);

    this[isAppErrorSymbol] = true;
    this.kind = kind;
  }

  public static isAppError(value: unknown): value is AppError {
    return (
      typeof value === 'object' &&
      value !== null &&
      (value as Record<string | symbol, unknown>)[isAppErrorSymbol] === true
    );
  }

  public static isAppErrorOfKind(
    value: unknown,
    kind: AppErrorKind,
  ): value is AppError {
    return AppError.isAppError(value) && value.kind === kind;
  }
}

type QueryReturnValue<T = unknown, TErr = unknown, TMeta = unknown> =
  | {
      error: TErr;
      data?: undefined;
      meta?: TMeta;
    }
  | {
      error?: undefined;
      data: T;
      meta?: TMeta;
    };

interface CreateAuthV2Args {
  accessToken: string;
  authCreateQuery: apiModels.AuthCreateQueryV2;
}

async function createAuthV2Mutation(
  args: CreateAuthV2Args,
): Promise<QueryReturnValue<apiModels.AuthV2, AppError, never>> {
  const authV2: AuthResponse = await httpClient.endpoints.createAuthV2(
    {
      authorization: `Bearer ${args.accessToken}`,
    },
    args.authCreateQuery,
  );

  switch (authV2.statusCode) {
    case OK:
      return {
        data: authV2.body,
      };
    case BAD_REQUEST:
      return {
        error: new AppError(
          AppErrorKind.contractViolation,
          authV2.body.description,
        ),
      };
    case UNAUTHORIZED:
      return {
        error: new AppError(
          AppErrorKind.missingCredentials,
          authV2.body.description,
        ),
      };
    default:
      return {
        error: new AppError(AppErrorKind.unknown),
      };
  }
}

export const backendApi = createApi({
  baseQuery: fakeBaseQuery<AppError>(),
  endpoints: (build) => ({
    createAuthV2: build.mutation<apiModels.AuthV2, CreateAuthV2Args>({
      queryFn: createAuthV2Mutation,
    }),
  }),
});
