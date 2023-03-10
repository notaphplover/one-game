export interface Handler<TParams extends unknown[], TOutput> {
  handle(...params: TParams): Promise<TOutput>;
}
