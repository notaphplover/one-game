import { Request } from './Request';

export interface RequestWithBody extends Request {
  body: Record<string, unknown>;
}
