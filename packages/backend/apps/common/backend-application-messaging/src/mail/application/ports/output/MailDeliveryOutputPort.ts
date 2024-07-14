import { MessageSendOptions } from '../../models/MessageSendOptions';

export interface MessageSendOutputPort {
  send<T>(options: MessageSendOptions<T>): Promise<void>;
}

export const messageSendOutputPortSymbol: symbol = Symbol.for(
  'MessageSendOutputPort',
);
