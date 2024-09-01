import { HttpClientEndpoints } from '@cornie-js/api-http-client';
import { useEffect, useState } from 'react';

import { HttpApiParams } from '../http/models/HttpApiParams';
import { HttpApiResult } from '../http/models/HttpApiResult';
import { httpClient } from '../http/services/httpClient';
import { Either } from '../models/Either';

export enum ApiCallStatus {
  idle,
  pending,
}

export interface UseSingleApiCallParams<
  TContext,
  TParams,
  TEndpoint extends keyof HttpClientEndpoints,
  TResult,
> {
  endpoint: TEndpoint;
  buildErrorMessage(err: unknown): string;
  buildRequestParams(
    context: TContext,
    params: TParams,
  ): HttpApiParams<TEndpoint>;
  buildResult(httpResponse: HttpApiResult<TEndpoint>): Either<string, TResult>;
  useContext(): { context: TContext };
}

export interface SingleApiCallResult<TParams, TResult> {
  result: Either<string, TResult> | null;
  call(params: TParams): void;
}

export function useSingleApiCall<
  TContext,
  TParams,
  TEndpoint extends keyof HttpClientEndpoints,
  TResult,
>(
  buildParams: UseSingleApiCallParams<TContext, TParams, TEndpoint, TResult>,
): SingleApiCallResult<TParams, TResult> {
  const { context }: { context: TContext } = buildParams.useContext();

  const [result, setResult] = useState<Either<string, TResult> | null>(null);
  const [params, setParams] = useState<TParams | null>(null);
  const [status, setStatus] = useState<ApiCallStatus>(ApiCallStatus.idle);

  function call(params: TParams): void {
    if (status !== ApiCallStatus.idle) {
      throw new Error(
        'Unable to call. Reason: a pending request is being handled',
      );
    }

    setParams(params);
    setStatus(ApiCallStatus.pending);
  }

  async function handleRequest(): Promise<HttpApiResult<TEndpoint>> {
    const requestParams: HttpApiParams<TEndpoint> =
      buildParams.buildRequestParams(context, params as TParams);

    return (
      httpClient.endpoints[buildParams.endpoint] as (
        ...params: HttpApiParams<TEndpoint>
      ) => Promise<HttpApiResult<TEndpoint>>
    )(...requestParams);
  }

  useEffect(() => {
    void (async () => {
      switch (status) {
        case ApiCallStatus.pending:
          try {
            const httpResult: HttpApiResult<TEndpoint> = await handleRequest();

            setResult(buildParams.buildResult(httpResult));
          } catch (error: unknown) {
            setResult({
              isRight: false,
              value: buildParams.buildErrorMessage(error),
            });
          } finally {
            setStatus(ApiCallStatus.idle);
          }
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
