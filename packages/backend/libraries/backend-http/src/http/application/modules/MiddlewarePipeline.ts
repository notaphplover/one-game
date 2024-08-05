import { isPromiseLike } from '../../../common/application/calculations/isPromiseLike';
import { Request } from '../models/Request';
import { RequestWithBody } from '../models/RequestWithBody';
import { Response } from '../models/Response';
import { ResponseWithBody } from '../models/ResponseWithBody';
import { Middleware } from './Middleware';

export class MiddlewarePipeline {
  readonly #middlewares: Middleware[];

  constructor(middlewares: Middleware[]) {
    this.#middlewares = middlewares;
  }

  public async apply(
    request: Request | RequestWithBody,
  ): Promise<undefined | Response | ResponseWithBody<unknown>> {
    let responseOrUndefined: undefined | Response | ResponseWithBody<unknown> =
      undefined;

    const next: (response: Response | ResponseWithBody<unknown>) => void = (
      response: Response | ResponseWithBody<unknown>,
    ) => {
      responseOrUndefined = response;
    };

    for (const middleware of this.#middlewares) {
      const result: void | Promise<void> = middleware.handle(request, next);

      if (isPromiseLike(result)) {
        await result;
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (responseOrUndefined !== undefined) {
        break;
      }
    }

    return responseOrUndefined;
  }
}
