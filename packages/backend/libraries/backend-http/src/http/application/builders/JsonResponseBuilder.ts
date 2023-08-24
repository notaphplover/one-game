import { ResponseBuilder } from './ResponseBuilder';

export abstract class JsonResponseBuilder<
  TParams extends unknown[],
> extends ResponseBuilder<TParams> {
  protected _getHttpResponseHeaders(): Record<string, string> {
    return { 'content-type': 'application/json' };
  }
}
