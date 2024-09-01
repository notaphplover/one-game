import { HttpClientEndpoints } from '@cornie-js/api-http-client';
import { MutexInterface } from 'async-mutex';
import { useEffect, useState } from 'react';

import logout from '../../app/store/actions/logout';
import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { AppDispatch } from '../../app/store/store';
import { createAuthByRefreshToken } from '../../app/store/thunk/createAuthByRefreshToken';
import { isFullfilledPayloadAction } from '../helpers/isFullfilledPayloadAction';
import { OK, UNAUTHORIZED } from '../http/helpers/httpCodes';
import { refreshTokenMutex } from '../http/helpers/refresTokenMutex';
import { HttpApiResult } from '../http/models/HttpApiResult';
import { httpClient } from '../http/services/httpClient';
import { Either } from '../models/Either';
import {
  SingleApiCallResult,
  UseSingleApiCallParams,
} from './useSingleApiCall';

export enum ApiCallStatus {
  idle,
  pending,
  refreshing,
  retrying,
}

export function useSingleAuthorizedApiCall<
  TContext,
  TParams,
  TEndpoint extends keyof HttpClientEndpoints,
  TResult,
>(
  buildParams: UseSingleApiCallParams<TContext, TParams, TEndpoint, TResult>,
): SingleApiCallResult<TParams, TResult> {
  const dispatch: AppDispatch = useAppDispatch();

  const { context }: { context: TContext } = buildParams.useContext();

  const [result, setResult] = useState<Either<string, TResult> | null>(null);
  const [params, setParams] = useState<TParams | null>(null);
  const [status, setStatus] = useState<ApiCallStatus>(ApiCallStatus.idle);

  const refreshToken: string | null =
    useAppSelector(selectAuthenticatedAuth)?.refreshToken ?? null;

  function call(params: TParams): void {
    if (status !== ApiCallStatus.idle) {
      throw new Error(
        'Unable to call. Reason: a pending request is being handled',
      );
    }

    setParams(params);
    setStatus(ApiCallStatus.pending);
  }

  async function handlePendingApiCall(): Promise<void> {
    try {
      await refreshTokenMutex.waitForUnlock();

      const httpResult: HttpApiResult<TEndpoint> = await callEndpoint(
        buildParams.endpoint,
        buildParams.buildRequestParams(context, params as TParams),
      );

      setResult(buildParams.buildResult(httpResult));

      if (httpResult.statusCode === UNAUTHORIZED) {
        setStatus(ApiCallStatus.refreshing);
      } else {
        setStatus(ApiCallStatus.idle);
      }
    } catch (error: unknown) {
      setResult({
        isRight: false,
        value: buildParams.buildErrorMessage(error),
      });
      setStatus(ApiCallStatus.idle);
    }
  }

  async function handleRefreshToken(): Promise<void> {
    if (refreshToken === null) {
      setStatus(ApiCallStatus.idle);
      return;
    }

    if (refreshTokenMutex.isLocked()) {
      await refreshTokenMutex.waitForUnlock();
      setStatus(ApiCallStatus.retrying);
    } else {
      const release: MutexInterface.Releaser =
        await refreshTokenMutex.acquire();

      try {
        const payloadAction = await dispatch(
          createAuthByRefreshToken(refreshToken),
        );

        if (
          !isFullfilledPayloadAction(payloadAction) ||
          payloadAction.payload.statusCode !== OK
        ) {
          dispatch(logout());
        }
      } finally {
        release();
      }

      setStatus(ApiCallStatus.retrying);
    }
  }

  async function handleRetryApiCall(): Promise<void> {
    try {
      await refreshTokenMutex.waitForUnlock();

      const httpResult: HttpApiResult<TEndpoint> = await callEndpoint(
        buildParams.endpoint,
        buildParams.buildRequestParams(context, params as TParams),
      );

      setResult(buildParams.buildResult(httpResult));
    } catch (error: unknown) {
      setResult({
        isRight: false,
        value: buildParams.buildErrorMessage(error),
      });
    } finally {
      setStatus(ApiCallStatus.idle);
    }
  }

  useEffect(() => {
    void (async () => {
      switch (status) {
        case ApiCallStatus.pending:
          await handlePendingApiCall();
          break;
        case ApiCallStatus.refreshing:
          await handleRefreshToken();
          break;
        case ApiCallStatus.retrying:
          await handleRetryApiCall();
          break;
        default:
      }
    })();
  }, [status]);

  return {
    call,
    result,
  };
}

async function callEndpoint<TEndpoint extends keyof HttpClientEndpoints>(
  endpoint: TEndpoint,
  params: Parameters<HttpClientEndpoints[TEndpoint]>,
): Promise<Awaited<ReturnType<HttpClientEndpoints[TEndpoint]>>> {
  return await (
    httpClient.endpoints[endpoint] as (
      ...params: Parameters<HttpClientEndpoints[TEndpoint]>
    ) => ReturnType<HttpClientEndpoints[TEndpoint]>
  )(...params);
}
