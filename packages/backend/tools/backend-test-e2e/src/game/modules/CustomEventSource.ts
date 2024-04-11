import { EventSource, EventSourceInit } from '@cornie-js/eventsource';

export class CustomEventSource extends EventSource {
  readonly #token: string | undefined;

  constructor(
    url: string,
    eventSourceInitDict: EventSourceInit & { token?: string } = {},
  ) {
    super(url, eventSourceInitDict);

    this.#token = eventSourceInitDict.token;
  }

  protected override _buildHeaders(): Headers {
    // Keep other relevant SSE headers in the base class method.
    const headers: Headers = super._buildHeaders();

    if (this.#token !== undefined) {
      headers.set('authorization', `Bearer ${this.#token}`);
    }

    return headers;
  }
}
