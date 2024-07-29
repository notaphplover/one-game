import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { Consumer, Message } from 'pulsar-client';

@Injectable()
export abstract class PulsarConsumer<TMessage> {
  readonly #consumer: Consumer;
  readonly #logger: LoggerService;

  constructor(consumer: Consumer) {
    this.#consumer = consumer;
    this.#logger = new Logger(PulsarConsumer.name);
  }

  public async handleMessages(): Promise<void> {
    while (this.#consumer.isConnected()) {
      let pulsarMessage: Message;

      try {
        this.#logger.log('Waiting for next message ...');
        pulsarMessage = await this.#consumer.receive();
      } catch (error: unknown) {
        this.#logger.error(`Unexpected error while receiving message: 
${this.#stringifyError(error)}`);
        continue;
      }

      try {
        const message: TMessage = this._messageFromBuffer(
          pulsarMessage.getData(),
        );

        await this._handleMessage(message);
        await this.#consumer.acknowledge(pulsarMessage);
      } catch (error: unknown) {
        this.#logger.error(`Unexpected error while processing message: 
          ${this.#stringifyError(error)}`);

        this.#logger.log('sending negative ack...');

        this.#consumer.negativeAcknowledge(pulsarMessage);

        continue;
      }
    }
  }

  protected _messageFromBuffer(data: Buffer): TMessage {
    return JSON.parse(data.toString('utf-8')) as TMessage;
  }

  #stringifyError(error: unknown): string {
    return JSON.stringify(error, Object.getOwnPropertyNames(error));
  }

  protected abstract _handleMessage(message: TMessage): Promise<void>;
}
