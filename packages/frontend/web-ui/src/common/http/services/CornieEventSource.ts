import { EventSource } from '@cornie-js/eventsource';

export interface CornieEventSourceInit extends EventSourceInit {
  defaultLastEventId?: string | undefined;
  getAccessToken: () => string;
}

export class CornieEventSource extends EventSource {
  readonly #defaultLastEventId: string | undefined;
  readonly #getAccessToken: () => string;

  constructor(url: string, eventSourceInitDict: CornieEventSourceInit) {
    const { defaultLastEventId, getAccessToken, ...eventSourceInit } =
      eventSourceInitDict;

    super(url, eventSourceInit);

    this.#defaultLastEventId = defaultLastEventId;
    this.#getAccessToken = getAccessToken;
  }

  protected override _buildHeaders(): Headers {
    const headers: Headers = super._buildHeaders();

    headers.set('authorization', `Bearer ${this.#getAccessToken()}`);

    if (
      !headers.has('last-event-id') &&
      this.#defaultLastEventId !== undefined
    ) {
      headers.set('last-event-id', this.#defaultLastEventId);
    }

    return headers;
  }
}
