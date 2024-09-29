# Eventsource

An spec compliant implementation of the Eventsource [spec](https://html.spec.whatwg.org/multipage/server-sent-events.html) with useful extensions

## What do you mean by "spec compliant"
Well, It's not currently possible to write a 100% spec compliant in javascript at the moment. There're small well-known discrepancies with the spec:

- Request initiator type cannot be "other" as stated in the [spec](https://html.spec.whatwg.org/multipage/server-sent-events.html#the-eventsource-interface).
- Request redirections are followed, not only 301 and 307 ones as
the non normative [introduction section](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events-intro) states.
- There's no way to access to the aborted flag of a response. Due to this fact, there's no way to know whether or not an error typed response is an aborted network error one. For this reason, network errors as defined in the spec triggers an attempt to restablish the connection instead of failing the connection if the response is an aborted network error as the spec states.

## Extensions

### Custom headers

Like any other class, `EventSource` can be extended. The `_buildHeaders` method can be overridden in order to build custom headers:

```ts
import { EventSource, EventSourceInit } from '@cornie-js/eventsource';

class CustomEventSource extends EventSource {
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
```

Why not simply providing an optional `headers` parameter in the constructor? Well, most auth flows are way more complex than simply
passing some pre established headers. As an example, JWT tokens must be renewed once the expiration time is reached.
