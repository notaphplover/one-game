import {
  MessageDeliveryScheduleKind,
  MessageSendOptions,
  MessageSendOutputPort,
} from '@cornie-js/backend-application-messaging';
import { Injectable } from '@nestjs/common';
import { Producer, ProducerMessage } from 'pulsar-client';

@Injectable()
export class MessageSendPulsarAdapter implements MessageSendOutputPort {
  readonly #producer: Producer;

  constructor(producer: Producer) {
    this.#producer = producer;
  }

  public async send<TMessage>(
    options: MessageSendOptions<TMessage>,
  ): Promise<void> {
    const producerMessage: ProducerMessage = {
      data: this._bufferFromMessage(options.data),
    };

    this.#handleDeliveryOptions(producerMessage, options);

    await this.#producer.send(producerMessage);
  }

  protected _bufferFromMessage<TMessage>(message: TMessage): Buffer {
    return Buffer.from(JSON.stringify(message), 'utf-8');
  }

  #handleDeliveryOptions<TMessage>(
    producerMessage: ProducerMessage,
    options: MessageSendOptions<TMessage>,
  ): void {
    if (options.delivery !== undefined) {
      if (options.delivery.schedule !== undefined) {
        switch (options.delivery.schedule.kind) {
          case MessageDeliveryScheduleKind.delay:
            producerMessage.deliverAfter = options.delivery.schedule.delayMs;
            break;
        }
      }
    }
  }
}
