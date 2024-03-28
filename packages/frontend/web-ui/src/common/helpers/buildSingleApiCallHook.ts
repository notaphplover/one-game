import { HttpClient } from '@cornie-js/api-http-client';
import { useEffect, useState } from 'react';
import { Either, Left, Right } from '../models/Either';
import { httpClient } from '../http/services/HttpService';

export enum ApiHookStatus {
  idle,
  pending,
}

export type HttpApiResult<TEndpoint extends keyof HttpClient> = Awaited<
  ReturnType<HttpClient[TEndpoint]>
>;

export type HttpApiParams<TEndpoint extends keyof HttpClient> = Parameters<
  HttpClient[TEndpoint]
>;

export interface BuildSingleApiCallHookParams<
  TContext,
  TParams,
  TEndpoint extends keyof HttpClient,
> {
  buildContext(): TContext;
  buildErrorMessage(err: unknown): string;
  buildRequestParams(
    context: TContext,
    params: TParams,
  ): HttpApiParams<TEndpoint>;
  endpoint: TEndpoint;
}

export interface SingleApiCallHookResult<TParams, TResult> {
  call(params: TParams): void;
  result: Either<string, TResult> | null;
}

export function buildSingleApiCallHook<
  TContext,
  TParams,
  TEndpoint extends keyof HttpClient,
>(
  buildParams: BuildSingleApiCallHookParams<TContext, TParams, TEndpoint>,
): SingleApiCallHookResult<TParams, HttpApiResult<TEndpoint>> {
  const context: TContext = buildParams.buildContext();

  const [result, setResult] = useState<Either<
    string,
    HttpApiResult<TEndpoint>
  > | null>(null);
  const [params, setParams] = useState<TParams | null>(null);
  const [status, setStatus] = useState<ApiHookStatus>(ApiHookStatus.idle);

  function call(params: TParams): void {
    if (status !== ApiHookStatus.idle) {
      throw new Error(
        'Unable to call. Reason: a pending request is being handled',
      );
    }

    setParams(params);
    setStatus(ApiHookStatus.pending);
  }

  async function handleRequest(): Promise<HttpApiResult<TEndpoint>> {
    const requestParams: HttpApiParams<TEndpoint> =
      buildParams.buildRequestParams(context, params as TParams);

    return (
      httpClient[buildParams.endpoint] as (
        ...params: HttpApiParams<TEndpoint>
      ) => Promise<HttpApiResult<TEndpoint>>
    )(...requestParams);
  }

  useEffect(() => {
    void (async () => {
      switch (status) {
        case ApiHookStatus.pending:
          try {
            const result: HttpApiResult<TEndpoint> = await handleRequest();

            setResult({
              isRight: true,
              value: result,
            });
          } catch (error: unknown) {
            setResult({
              isRight: false,
              value: buildParams.buildErrorMessage(error),
            });
          } finally {
            setStatus(ApiHookStatus.idle);
          }
          break;
      }
    })();
  }, [status, context]);

  return {
    call,
    result,
  };
}
