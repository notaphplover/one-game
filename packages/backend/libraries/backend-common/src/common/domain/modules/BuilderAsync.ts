import { Builder } from './Builder';

export type BuilderAsync<
  TResult = unknown,
  TParams extends unknown[] = [],
> = Builder<Promise<TResult>, TParams>;
