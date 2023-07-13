import axios from 'axios';

import { Response } from '../models/Response';

export class AxiosHttpClient {
  readonly #axiosClient: axios.AxiosInstance;

  constructor(baseUrl: string) {
    this.#axiosClient = axios.create({
      baseURL: baseUrl,
    });
  }

  public async callEndpoint(
    method: string,
    url: string,
    headers: Record<string, string> | undefined,
    queryParams:
      | Record<string, number | number[] | string | string[]>
      | undefined,
    urlParameters: Record<string, string> | undefined,
    body: unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<Response<any, any, any>> {
    let processedUrl: string;

    if (urlParameters === undefined) {
      processedUrl = url;
    } else {
      processedUrl = Object.entries(urlParameters).reduce<string>(
        (
          url: string,
          [urlParamName, urlParamValue]: [string, string],
        ): string => url.replace(`{${urlParamName}}`, urlParamValue),
        url,
      );
    }

    const axiosRequestConfig: axios.AxiosRequestConfig = {
      method: method as axios.Method,
      url: processedUrl,
    };

    if (headers !== undefined) {
      axiosRequestConfig.headers = headers;
    }

    if (queryParams !== undefined) {
      axiosRequestConfig.params = queryParams;
    }

    if (body !== undefined) {
      axiosRequestConfig.data = body;
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

    return response;
  }
}
