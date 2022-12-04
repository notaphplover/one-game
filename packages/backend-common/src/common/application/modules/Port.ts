export interface Port<TParams, TResult> {
  call(params: TParams): Promise<TResult>;
}
