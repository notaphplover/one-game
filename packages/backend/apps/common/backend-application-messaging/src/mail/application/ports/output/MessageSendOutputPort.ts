import { MessageSendOptions } from '../../models/MessageSendOptions';

export interface MessageSendOutputPort<T> {
  send(options: MessageSendOptions<T>): Promise<void>;
}

export const messageSendOutputPortSymbol: symbol = Symbol.for(
  'MessageSendOutputPort',
);
