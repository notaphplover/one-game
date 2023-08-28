export interface Publisher<T> {
  publish(value: T): void;
}
