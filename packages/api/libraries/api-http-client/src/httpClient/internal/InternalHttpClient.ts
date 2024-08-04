import qs from 'qs';

import { Interceptor } from '../models/Interceptor';
import { Request as HttpRequest } from '../models/Request';
import { Response as HttpResponse } from '../models/Response';
import { UseInterceptorOptions } from '../models/UseInterceptorOptions';

export class InternalHttpClient {
  readonly #baseUrl: string;
  readonly #interceptorsMap: Map<number | null, Interceptor>;

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl;
    this.#interceptorsMap = new Map();
  }

  public async callEndpoint(
    httpRequest: HttpRequest,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<HttpResponse<any, any, any>> {
    let processedUrl: string = this.#baseUrl;

    if (httpRequest.urlParameters === undefined) {
      processedUrl += httpRequest.path;
    } else {
      processedUrl += Object.entries(httpRequest.urlParameters).reduce<string>(
        (
          url: string,
          [urlParamName, urlParamValue]: [string, string],
        ): string => url.replace(`{${urlParamName}}`, urlParamValue),
        httpRequest.path,
      );
    }

    if (httpRequest.queryParams !== undefined) {
      processedUrl +=
        '?' + qs.stringify(httpRequest.queryParams, { indices: false });
    }

    const requestInit: RequestInit = {
      method: httpRequest.method,
      redirect: 'follow',
    };

    if (httpRequest.headers !== undefined) {
      requestInit.headers = httpRequest.headers;
    }

    if (httpRequest.body !== undefined) {
      if (requestInit.headers === undefined) {
        requestInit.headers = {};
      }

      (requestInit.headers as Record<string, string | ReadonlyArray<string>>)[
        'content-type'
      ] = 'application/json';

      requestInit.body = JSON.stringify(httpRequest.body);
    }

    const request: Request = new Request(processedUrl, requestInit);

    const fetchResponse: Response = await fetch(request);

    const headers: Record<string, string> = {};

    for (const [headerKey, headerValue] of fetchResponse.headers.entries()) {
      headers[headerKey] = headerValue;
    }

    const response: HttpResponse = {
      body: await this.#parseResponseBody(fetchResponse),
      headers,
      statusCode: fetchResponse.status,
    };

    const interceptor: Interceptor | undefined = this.#getInterceptor(
      response.statusCode,
    );

    if (interceptor === undefined) {
      return response;
    }

    return interceptor(httpRequest, response);
  }

  public useInterceptor(
    interceptor: Interceptor,
    options?: UseInterceptorOptions,
  ): void {
    if (options?.status === undefined) {
      this.#interceptorsMap.set(null, interceptor);
      return;
    }

    const statusCodes: number[] = Array.isArray(options.status)
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

  async #parseResponseBody(response: Response): Promise<unknown> {
    const contentTypeHeader: string | null =
      response.headers.get('content-type');
    const contentLenghtHeader: string | null =
      response.headers.get('content-length');
    const contentLength: number | undefined =
      typeof contentLenghtHeader === 'string'
        ? parseInt(contentLenghtHeader)
        : undefined;

    if (contentTypeHeader === null) {
      return undefined;
    }

    if (
      contentTypeHeader.includes('application/json') &&
      contentLength !== undefined &&
      contentLength > 0
    ) {
      return response.json();
    }

    return response.text();
  }
}
