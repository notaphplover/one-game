import { MessageDeliveryOptions } from './MessageDeliveryOptions';

export interface MessageSendOptions<T> {
  data: T;
  delivery?: MessageDeliveryOptions;
}
