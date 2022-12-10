export interface Validator<T> {
  errors?: string | null;
  validate: (data: unknown) => data is T;
}
