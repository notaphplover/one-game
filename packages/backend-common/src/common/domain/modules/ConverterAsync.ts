import { Converter } from './Converter';

export type ConverterAsync<TInput, TOutput> = Converter<
  TInput,
  Promise<TOutput>
>;
