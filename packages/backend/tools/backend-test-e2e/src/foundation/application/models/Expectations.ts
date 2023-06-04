export type Expectations<T> = Partial<{
  [TKey in keyof T]:
    | Expectations<T[TKey]>
    | T[TKey]
    | ((value: T[TKey], path: string, rootObject: object) => void);
}>;
