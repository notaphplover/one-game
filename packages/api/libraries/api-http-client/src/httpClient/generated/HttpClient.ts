import { InternalHttpClient } from '../internal/InternalHttpClient';
import { Interceptor } from '../models/Interceptor';
import { UseInterceptorOptions } from '../models/UseInterceptorOptions';
import { HttpClientEndpoints } from './HttpClientEndpoints';

export class HttpClient {
  readonly #internalHttpClient: InternalHttpClient;

  readonly #httpClientEndpoints: HttpClientEndpoints;

  constructor(baseUrl: string) {
    this.#internalHttpClient = new InternalHttpClient(baseUrl);
    this.#httpClientEndpoints = new HttpClientEndpoints(
      this.#internalHttpClient,
    );
  }

  public get endpoints(): HttpClientEndpoints {
    return this.#httpClientEndpoints;
  }

  public useInterceptor(
    interceptor: Interceptor,
    useInterceptorOptions?: UseInterceptorOptions,
  ): void {
    this.#internalHttpClient.useInterceptor(interceptor, useInterceptorOptions);
  }
}
