import { IncomingHttpHeaders } from 'http';

import { AppError, AppErrorKind, Builder } from '@one-game-js/backend-common';
import { FastifyRequest } from 'fastify';

import { Request } from '../../../application/models/Request';

export class RequestFromFastifyRequestBuilder
  implements Builder<Request, [FastifyRequest]>
{
  public build(request: FastifyRequest): Request {
    return {
      headers: this.#parseRequests(request.headers),
      query: this.#parseQuery(request.query),
      urlParameters: this.#parseParameters(request.params),
    };
  }

  #filterOutUndefined<T>(
    input: Record<string, T | undefined>,
  ): Record<string, T> {
    const filteredObject: Record<string, T> = {};

    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        filteredObject[key] = value;
      }
    }

    return filteredObject;
  }

  #isStringRecord(value: unknown): value is Record<string, string> {
    return (
      value !== null &&
      typeof value === 'object' &&
      Object.values(value).every(
        (valueElement: unknown) => typeof valueElement === 'string',
      )
    );
  }

  #isStringOrStringArrayRecord(
    value: unknown,
  ): value is Record<string, string | string[]> {
    return (
      value !== null &&
      typeof value === 'object' &&
      Object.values(value).every(
        (valueElement: unknown) =>
          typeof valueElement === 'string' ||
          (Array.isArray(valueElement) &&
            valueElement.every(
              (valueElementElement: unknown) =>
                typeof valueElementElement === 'string',
            )),
      )
    );
  }

  #parseParameters(params: unknown): Record<string, string> {
    if (params === undefined) {
      return {};
    }

    return params as Record<string, string>;
  }

  #parseRequests(headers: IncomingHttpHeaders): Record<string, string> {
    const filteredHeaders: Record<string, string | string[]> =
      this.#filterOutUndefined(headers);

    if (!this.#isStringRecord(filteredHeaders)) {
      throw new AppError(AppErrorKind.unknown, 'Invalid request headers!');
    }

    return filteredHeaders;
  }

  #parseQuery(query: unknown): Record<string, string | string[]> {
    if (query === undefined) {
      return {};
    }

    if (!this.#isStringOrStringArrayRecord(query)) {
      throw new AppError(AppErrorKind.unknown, 'Invalid request query!');
    }

    return query;
  }
}
