export interface Builder<TResult = unknown, TParams extends unknown[] = []> {
  build(...params: TParams): TResult;
}
