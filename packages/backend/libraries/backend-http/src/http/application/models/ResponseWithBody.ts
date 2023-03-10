import { Response } from './Response';

export interface ResponseWithBody<TBody> extends Response {
  body: TBody;
}
