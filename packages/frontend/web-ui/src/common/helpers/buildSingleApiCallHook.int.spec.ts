jest.mock('../http/services/HttpService');

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { HttpClient } from '@cornie-js/api-http-client';
import {
  RenderHookResult,
  act,
  renderHook,
  waitFor,
} from '@testing-library/react';

import { HttpApiParams } from '../http/models/HttpApiParams';
import { HttpApiResult } from '../http/models/HttpApiResult';
import { httpClient } from '../http/services/HttpService';
import { Either } from '../models/Either';
import {
  BuildSingleApiCallHookParams,
  SingleApiCallHookResult,
  buildSingleApiCallHook,
} from './buildSingleApiCallHook';

type TestContext = void;
type TestParams = void;
type TestEndpoint = 'createAuth';

interface TestResult {
  foo: string;
}

describe(buildSingleApiCallHook.name, () => {
  let buildSingleApiCallHookParamsMock: jest.Mocked<
    BuildSingleApiCallHookParams<
      TestContext,
      TestParams,
      TestEndpoint,
      TestResult
    >
  >;

  beforeAll(() => {
    buildSingleApiCallHookParamsMock = {
      buildContext: jest.fn(),
      buildErrorMessage: jest.fn(),
      buildRequestParams: jest.fn(),
      buildResult: jest.fn(),
      endpoint: 'createAuth',
    };
  });

  describe('when called, and call() is called, and handleRequest() resolves an HttpApiResult<TEndpoint>', () => {
    let contextFixture: TestContext;
    let httpApiParamsFixture: HttpApiParams<TestEndpoint>;
    let httpApiResultFixture: HttpApiResult<TestEndpoint>;
    let resultFixture: Either<string, TestResult>;

    let renderHookResult: RenderHookResult<
      SingleApiCallHookResult<TestParams, TestResult>,
      unknown
    >;

    beforeAll(async () => {
      contextFixture = undefined;
      httpApiParamsFixture = [
        Symbol(),
      ] as unknown as HttpApiParams<TestEndpoint>;
      httpApiResultFixture = Symbol() as unknown as HttpApiResult<TestEndpoint>;
      resultFixture = {
        isRight: true,
        value: {
          foo: 'bar',
        },
      };

      buildSingleApiCallHookParamsMock.buildContext.mockReturnValueOnce(
        contextFixture,
      );
      buildSingleApiCallHookParamsMock.buildRequestParams.mockReturnValueOnce(
        httpApiParamsFixture,
      );
      buildSingleApiCallHookParamsMock.buildResult.mockReturnValueOnce(
        resultFixture,
      );

      (httpClient as jest.Mocked<HttpClient>).endpoints[
        buildSingleApiCallHookParamsMock.endpoint
      ].mockResolvedValueOnce(httpApiResultFixture);

      renderHookResult = renderHook(() =>
        buildSingleApiCallHook(buildSingleApiCallHookParamsMock),
      );

      act(() => {
        renderHookResult.result.current.call(undefined);
      });

      await waitFor(() => {
        // eslint-disable-next-line jest/no-standalone-expect
        expect(renderHookResult.result.current.result).not.toBeNull();
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a result', () => {
      expect(renderHookResult.result.current.result).toStrictEqual(
        resultFixture,
      );
    });
  });
});
