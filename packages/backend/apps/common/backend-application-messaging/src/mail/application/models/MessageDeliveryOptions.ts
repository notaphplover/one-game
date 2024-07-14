export interface MessageDeliveryOptions {
  schedule?: MessageDeliverySchedule;
}

export type MessageDeliverySchedule = MessageDeliveryDelaySchedule;

export interface MessageDeliveryDelaySchedule {
  delayMs: number;
  kind: MessageDeliveryScheduleKind.delay;
}

export enum MessageDeliveryScheduleKind {
  delay = 'delay',
}
