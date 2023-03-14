import { requestContextProperty } from './requestContextProperty';

export interface RequestContextHolder<
  TContext extends Record<string | symbol, unknown> = Record<
    string | symbol,
    unknown
  >,
> {
  [requestContextProperty]: TContext;
}
