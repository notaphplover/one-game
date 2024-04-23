import { MailClientAuthOptions } from './mail/application/models/MailClientAuthOptions';
import { MailClientOptions } from './mail/application/models/MailClientOptions';
import { MailDeliveryOptions } from './mail/application/models/MailDeliveryOptions';
import {
  MailDeliveryOutputPort,
  mailDeliveryOutputPortSymbol,
} from './mail/application/ports/output/MailDeliveryOutputPort';

export type {
  MailClientAuthOptions,
  MailClientOptions,
  MailDeliveryOptions,
  MailDeliveryOutputPort,
};

export { mailDeliveryOutputPortSymbol };
