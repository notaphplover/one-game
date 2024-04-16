import { AxiosHttpClient } from '../axios/AxiosHttpClient';
import { Interceptor } from '../models/Interceptor';
import { UseInterceptorOptions } from '../models/UseInterceptorOptions';
import { HttpClientEndpoints } from './HttpClientEndpoints';

export class HttpClient {
  readonly #axiosHttpClient: AxiosHttpClient;

  readonly #httpClientEndpoints: HttpClientEndpoints;

  constructor(baseUrl: string) {
    this.#axiosHttpClient = new AxiosHttpClient(baseUrl);
    this.#httpClientEndpoints = new HttpClientEndpoints(this.#axiosHttpClient);
  }

  public get endpoints(): HttpClientEndpoints {
    return this.#httpClientEndpoints;
  }

  public useInterceptor(
    interceptor: Interceptor,
    useInterceptorOptions?: UseInterceptorOptions,
  ): void {
    this.#axiosHttpClient.useInterceptor(interceptor, useInterceptorOptions);
  }
}
