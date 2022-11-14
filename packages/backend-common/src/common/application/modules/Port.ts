export interface Port<TParams, TResult> {
  adapt(params: TParams): Promise<TResult>;
}
