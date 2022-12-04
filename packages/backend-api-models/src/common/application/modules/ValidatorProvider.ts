import { Validator } from './Validator';

export interface ValidatorProvider<TId extends number | string> {
  initialize(): Promise<void>;
  provide<T>(id: TId): Validator<T>;
}
