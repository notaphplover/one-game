import { Injectable } from '@nestjs/common';
import { Consumer, Message } from 'pulsar-client';

@Injectable()
export abstract class PulsarConsumer<TMessage> {
  readonly #consumer: Consumer;

  constructor(consumer: Consumer) {
    this.#consumer = consumer;
  }

  protected async _handleMessages(): Promise<void> {
    while (this.#consumer.isConnected()) {
      let pulsarMessage: Message;

      try {
        pulsarMessage = await this.#consumer.receive();
      } catch (error: unknown) {
        continue;
      }

      try {
        const message: TMessage = this._messageFromBuffer(
          pulsarMessage.getData(),
        );

        await this._handleMessage(message);
        await this.#consumer.acknowledge(pulsarMessage);
      } catch (error: unknown) {
        this.#consumer.negativeAcknowledge(pulsarMessage);
        continue;
      }
    }
  }

  protected _messageFromBuffer(data: Buffer): TMessage {
    return JSON.parse(data.toString('utf-8')) as TMessage;
  }

  protected abstract _handleMessage(message: TMessage): Promise<void>;
}
