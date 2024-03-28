export interface PublisherAsync<T> {
  publish(value: T): Promise<void>;
}
