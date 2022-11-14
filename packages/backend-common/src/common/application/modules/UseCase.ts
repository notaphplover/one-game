export interface UseCase<TParams, TOutput> {
  handle(params: TParams): Promise<TOutput>;
}
