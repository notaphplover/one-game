import { models as apiModels } from '@cornie-js/api-models';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { BaseQueryApi } from '@reduxjs/toolkit/query';
import { MutexInterface } from 'async-mutex';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { AuthorizedEndpointsOptions } from '../models/AuthorizedEndpointsOptions';

export function authorizedApiCall<TArg, TResult, TState>(
  call: (
    args: TArg,
    api: BaseQueryApi,
    accessToken: string | null,
  ) => Promise<QueryReturnValue<TResult, SerializableAppError, never>>,
  options: AuthorizedEndpointsOptions<TState>,
): (
  args: TArg,
  api: BaseQueryApi,
) => Promise<QueryReturnValue<TResult, SerializableAppError, never>> {
  return async (
    args: TArg,
    api: BaseQueryApi,
  ): Promise<QueryReturnValue<TResult, SerializableAppError, never>> => {
    await options.mutex.waitForUnlock();

    const result: QueryReturnValue<TResult, SerializableAppError, never> =
      await call(
        args,
        api,
        options.selectAccessToken(api.getState() as TState),
      );

    if (
      result.error !== undefined &&
      result.error.kind === AppErrorKind.missingCredentials
    ) {
      const refreshToken: string | null = options.selectRefreshToken(
        api.getState() as TState,
      );

      if (refreshToken === null) {
        return result;
      }

      if (options.mutex.isLocked()) {
        await options.mutex.waitForUnlock();
      } else {
        const release: MutexInterface.Releaser = await options.mutex.acquire();

        try {
          const authV2Result: QueryReturnValue<
            apiModels.AuthV2,
            SerializableAppError,
            never
          > = await options.createAuthV2({
            refreshToken,
          });

          if (authV2Result.data !== undefined) {
            api.dispatch(options.login(authV2Result.data));
          } else {
            api.dispatch(options.logout());

            return result;
          }
        } finally {
          release();
        }

        await options.mutex.waitForUnlock();
      }

      return call(
        args,
        api,
        options.selectAccessToken(api.getState() as TState),
      );
    } else {
      return result;
    }
  };
}
