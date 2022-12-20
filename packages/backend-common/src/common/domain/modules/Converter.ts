export interface Converter<TInput, TOutput> {
  convert(input: TInput): TOutput;
}
