import {
  MessageDeliveryScheduleKind,
  MessageSendOptions,
  MessageSendOutputPort,
} from '@cornie-js/backend-application-messaging';
import { Injectable } from '@nestjs/common';
import { Producer, ProducerMessage } from 'pulsar-client';

@Injectable()
export class MessageSendPulsarAdapter<TMessage>
  implements MessageSendOutputPort<TMessage>
{
  readonly #producer: Producer;

  constructor(producer: Producer) {
    this.#producer = producer;
  }

  public async send(options: MessageSendOptions<TMessage>): Promise<void> {
    const producerMessage: ProducerMessage = {
      data: this._bufferFromMessage(options.data),
    };

    this.#handleDeliveryOptions(producerMessage, options);

    await this.#producer.send(producerMessage);
  }

  protected _bufferFromMessage(message: TMessage): Buffer {
    return Buffer.from(JSON.stringify(message), 'utf-8');
  }

  #handleDeliveryOptions(
    producerMessage: ProducerMessage,
    options: MessageSendOptions<TMessage>,
  ): void {
    if (options.delivery !== undefined) {
      if (options.delivery.schedule !== undefined) {
        switch (options.delivery.schedule.kind) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          case MessageDeliveryScheduleKind.delay:
            producerMessage.deliverAfter = options.delivery.schedule.delayMs;
            break;
        }
      }
    }
  }
}
