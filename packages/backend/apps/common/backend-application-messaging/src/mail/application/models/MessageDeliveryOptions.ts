export interface MessageDeliveryOptions {
  schedule?: MessageDeliverySchedule;
}

export type MessageDeliverySchedule =
  | MessageDeliveryDelaySchedule
  | MessageDeliveryTimeSchedule;

export interface MessageDeliveryDelaySchedule {
  delayMs: number;
  kind: MessageDeliveryScheduleKind.delay;
}

export interface MessageDeliveryTimeSchedule {
  timeStamp: number;
  kind: MessageDeliveryScheduleKind.time;
}

export enum MessageDeliveryScheduleKind {
  delay = 'delay',
  time = 'time',
}
