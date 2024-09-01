import { jest } from '@jest/globals';

import { HttpClient, HttpClientEndpoints } from '@cornie-js/api-http-client';

const endpointMethods: (keyof HttpClientEndpoints)[] = Reflect.ownKeys(
  HttpClientEndpoints.prototype,
).filter(
  (key: string | symbol): boolean => key !== 'constructor',
) as (keyof HttpClientEndpoints)[];

export function buildHttpClientMock(): jest.Mocked<HttpClient> {
  const initialHttpClient: jest.Mocked<HttpClientEndpoints> =
    {} as jest.Mocked<HttpClientEndpoints>;

  return {
    endpoints: endpointMethods.reduce<jest.Mocked<HttpClientEndpoints>>(
      (
        endpoints: jest.Mocked<HttpClientEndpoints>,
        endpointMethod: keyof HttpClientEndpoints,
      ): jest.Mocked<HttpClientEndpoints> => {
        (endpoints as unknown as Record<keyof HttpClientEndpoints, jest.Mock>)[
          endpointMethod
        ] = jest.fn();

        return endpoints;
      },
      initialHttpClient,
    ),
    useInterceptor: jest.fn(),
  } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;
}

export const httpClient: jest.Mocked<HttpClient> = buildHttpClientMock();
