import { Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { MessageEvent } from '../models/MessageEvent';

@Injectable()
export class StringifiedSseFromMessageEventBuilder
  implements Builder<string, [MessageEvent]>
{
  public build(messageEvent: MessageEvent): string {
    // Consider https://html.spec.whatwg.org/multipage/server-sent-events.html as reference
    const stringifiedType: string =
      messageEvent.type === undefined ? '' : `event: ${messageEvent.type}\n`;
    const stringifiedId: string =
      messageEvent.id === undefined ? '' : `id: ${messageEvent.id}\n`;
    const stringifiedRetry: string =
      messageEvent.retry === undefined ? '' : `retry: ${messageEvent.retry}\n`;
    const stringifiedData: string = this.#stringifyData(messageEvent.data);

    return (
      stringifiedType +
      stringifiedId +
      stringifiedRetry +
      stringifiedData +
      '\n'
    );
  }

  #stringifyData(data: string | string[]): string {
    if (Array.isArray(data)) {
      return data.map((line: string) => this.#stringifyDataLine(line)).join('');
    }

    return this.#stringifyDataLine(data);
  }

  #stringifyDataLine(line: string): string {
    return `data: ${line}\n`;
  }
}
