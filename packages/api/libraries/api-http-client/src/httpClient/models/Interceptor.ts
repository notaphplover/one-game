import { Request } from './Request';
import { Response } from './Response';

export type Interceptor = (
  request: Request,
  response: Response,
) => Promise<Response>;
