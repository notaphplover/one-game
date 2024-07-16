import {
  MessageDeliveryDelaySchedule,
  MessageDeliveryOptions,
  MessageDeliverySchedule,
  MessageDeliveryScheduleKind,
} from './mail/application/models/MessageDeliveryOptions';
import { MessageSendOptions } from './mail/application/models/MessageSendOptions';
import {
  MessageSendOutputPort,
  messageSendOutputPortSymbol,
} from './mail/application/ports/output/MessageSendOutputPort';

export type {
  MessageDeliveryDelaySchedule,
  MessageDeliveryOptions,
  MessageDeliverySchedule,
  MessageSendOptions,
  MessageSendOutputPort,
};

export { MessageDeliveryScheduleKind, messageSendOutputPortSymbol };
