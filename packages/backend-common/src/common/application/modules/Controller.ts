export interface Controller<TParams, TOutput> {
  handle(params: TParams): Promise<TOutput>;
}
