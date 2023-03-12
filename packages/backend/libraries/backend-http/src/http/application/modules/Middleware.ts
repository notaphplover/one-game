import { Request } from '../models/Request';
import { RequestWithBody } from '../models/RequestWithBody';
import { Response } from '../models/Response';
import { ResponseWithBody } from '../models/ResponseWithBody';

export interface Middleware<
  TRequest extends Request = Request | RequestWithBody,
  TResponse extends Response | ResponseWithBody<unknown> =
    | Response
    | ResponseWithBody<unknown>,
> {
  handle(
    request: TRequest,
    halt: (response: TResponse) => void,
  ): void | Promise<void>;
}
