jest.mock('../http/services/httpClient');

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { HttpClient } from '@cornie-js/api-http-client';
import { renderHook, RenderHookResult, waitFor } from '@testing-library/react';
import { act } from 'react';

import { HttpApiParams } from '../http/models/HttpApiParams';
import { HttpApiResult } from '../http/models/HttpApiResult';
import { httpClient } from '../http/services/httpClient';
import { Either } from '../models/Either';
import {
  SingleApiCallResult,
  useSingleApiCall,
  UseSingleApiCallParams,
} from './useSingleApiCall';

type TestContext = undefined;
type TestParams = undefined;
type TestEndpoint = 'createAuthV2';

interface TestResult {
  foo: string;
}

describe(useSingleApiCall.name, () => {
  let buildSingleApiCallHookParamsMock: jest.Mocked<
    UseSingleApiCallParams<TestContext, TestParams, TestEndpoint, TestResult>
  >;

  beforeAll(() => {
    buildSingleApiCallHookParamsMock = {
      buildErrorMessage: jest.fn(),
      buildRequestParams: jest.fn(),
      buildResult: jest.fn(),
      endpoint: 'createAuthV2',
      useContext: jest.fn(),
    };
  });

  describe('when called, and call() is called, and handleRequest() resolves an HttpApiResult<TEndpoint>', () => {
    let contextFixture: TestContext;
    let httpApiParamsFixture: HttpApiParams<TestEndpoint>;
    let httpApiResultFixture: HttpApiResult<TestEndpoint>;
    let resultFixture: Either<string, TestResult>;

    let renderHookResult: RenderHookResult<
      SingleApiCallResult<TestParams, TestResult>,
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

      buildSingleApiCallHookParamsMock.useContext.mockReturnValue({
        context: contextFixture,
      });
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
        useSingleApiCall(buildSingleApiCallHookParamsMock),
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

      buildSingleApiCallHookParamsMock.useContext.mockReset();
    });

    it('should return a result', () => {
      expect(renderHookResult.result.current.result).toStrictEqual(
        resultFixture,
      );
    });
  });
});
