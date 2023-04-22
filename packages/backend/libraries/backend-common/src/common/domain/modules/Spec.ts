export interface Spec<TArgs extends unknown[]> {
  isSatisfiedBy(...args: TArgs): boolean;
}
