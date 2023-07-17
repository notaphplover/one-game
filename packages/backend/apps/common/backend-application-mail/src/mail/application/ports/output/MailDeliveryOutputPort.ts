import { MailDeliveryOptions } from '../../models/MailDeliveryOptions';

export interface MailDeliveryOutputPort {
  send(deliveryOptions: MailDeliveryOptions): Promise<void>;
}

export const mailDeliveryOutputPortSymbol: symbol = Symbol.for(
  'MailDeliveryOutputPort',
);
