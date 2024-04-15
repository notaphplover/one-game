import * as axios from 'axios';
import qs from 'qs';

import { Interceptor } from '../models/Interceptor';
import { Request } from '../models/Request';
import { Response } from '../models/Response';
import { UseInterceptorOptions } from '../models/UseInterceptorOptions';

export class AxiosHttpClient {
  readonly #axiosClient: axios.AxiosInstance;
  readonly #interceptorsMap: Map<number | null, Interceptor>;

  constructor(baseUrl: string) {
    this.#axiosClient = axios.default.create({
      baseURL: baseUrl,
      paramsSerializer: (params: Record<string, unknown>): string =>
        qs.stringify(params, { indices: false }),
    });

    this.#interceptorsMap = new Map();
  }

  public async callEndpoint(
    request: Request,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<Response<any, any, any>> {
    let processedUrl: string;

    if (request.urlParameters === undefined) {
      processedUrl = request.path;
    } else {
      processedUrl = Object.entries(request.urlParameters).reduce<string>(
        (
          url: string,
          [urlParamName, urlParamValue]: [string, string],
        ): string => url.replace(`{${urlParamName}}`, urlParamValue),
        request.path,
      );
    }

    const axiosRequestConfig: axios.AxiosRequestConfig = {
      method: request.method as axios.Method,
      url: processedUrl,
    };

    if (request.headers !== undefined) {
      axiosRequestConfig.headers = request.headers;
    }

    if (request.queryParams !== undefined) {
      axiosRequestConfig.params = request.queryParams;
    }

    if (request.body !== undefined) {
      axiosRequestConfig.data = request.body;
    }

    let axiosResponse: axios.AxiosResponse;

    try {
      axiosResponse = await this.#axiosClient.request(axiosRequestConfig);
    } catch (error: unknown) {
      if ((error as axios.AxiosError).isAxiosError === true) {
        const axiosError: axios.AxiosError = error as axios.AxiosError;
        if (axiosError.response === undefined) {
          throw error;
        }

        axiosResponse = axiosError.response;
      } else {
        throw error;
      }
    }

    const response: Response = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body: axiosResponse.data,
      headers: axiosResponse.headers as Record<string, string>,
      statusCode: axiosResponse.status,
    };

    const interceptor: Interceptor | undefined = this.#getInterceptor(
      response.statusCode,
    );

    if (interceptor === undefined) {
      return response;
    }

    return interceptor(request, response);
  }

  public useInterceptor(
    interceptor: Interceptor,
    options?: UseInterceptorOptions,
  ): void {
    if (options?.status === undefined) {
      this.#interceptorsMap.set(null, interceptor);
      return;
    }

    const statusCodes: number[] = Array.isArray(options?.status)
      ? options.status
      : [options.status];

    for (const statusCode of statusCodes) {
      this.#interceptorsMap.set(statusCode, interceptor);
    }
  }

  #getInterceptor(statusCode: number): Interceptor | undefined {
    return (
      this.#interceptorsMap.get(statusCode) ?? this.#interceptorsMap.get(null)
    );
  }
}
