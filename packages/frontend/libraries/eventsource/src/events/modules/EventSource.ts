import { EventHandler, EventHandlerObject } from '../handlers/EventHandler';
import { NonMessageEvent } from '../models/NonMessageEvent';
import { fetchSse } from '../utils/fetch';
import { EventSourceEmitter } from './EventSourceEmitter';

export interface EventSourceInit {
  withCredentials?: boolean;
}

// https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attributes
type CorsSettingsAttribute = 'No CORS' | 'Anonymous' | 'Use Credentials';

const EVENT_STREAM_MIME_TYPE: string = 'text/event-stream';
const INITIAL_RETRY_MS: number = 1000;

export class EventSource implements EventTarget {
  // eslint-disable-next-line @typescript-eslint/prefer-as-const
  public readonly CONNECTING: 0 = 0;
  // eslint-disable-next-line @typescript-eslint/prefer-as-const
  public readonly OPEN: 1 = 1;
  // eslint-disable-next-line @typescript-eslint/prefer-as-const, @typescript-eslint/no-magic-numbers
  public readonly CLOSED: 2 = 2;

  #currentAbortController: AbortController | undefined;
  readonly #eventSourceEmitter: EventSourceEmitter;
  #lastEventId: string;
  #onerror: EventHandler<EventSource, Event> | null;
  #onmessage: EventHandler<EventSource, MessageEvent<unknown>> | null;
  #onopen: EventHandler<EventSource, Event> | null;
  #readyState: number;
  #retryMs: number;
  readonly #url: string;
  readonly #withCredentials: boolean;

  // Consider https://html.spec.whatwg.org/multipage/server-sent-events.html#the-eventsource-interface as reference

  constructor(url: string, eventSourceInitDict: EventSourceInit = {}) {
    this.#eventSourceEmitter = new EventSourceEmitter(this);
    this.#lastEventId = '';
    this.#onerror = null;
    this.#onmessage = null;
    this.#onopen = null;
    this.#retryMs = INITIAL_RETRY_MS;
    this.#url = this.#parseUrl(url);

    let corsAtributeState: CorsSettingsAttribute = 'Anonymous';

    if (eventSourceInitDict.withCredentials === true) {
      corsAtributeState = 'Use Credentials';
    }

    this.#withCredentials = eventSourceInitDict.withCredentials ?? false;

    this.#readyState = this.CONNECTING;

    setTimeout(() => {
      void this.#fetch(() =>
        this.#buildPotentialCorsRequest(this.#url, corsAtributeState),
      );
    }, 1);
  }

  public get onerror(): EventHandler<EventSource, Event> | null {
    return this.#onerror;
  }

  public get onmessage(): EventHandler<
    EventSource,
    MessageEvent<unknown>
  > | null {
    return this.#onmessage;
  }

  public get onopen(): EventHandler<EventSource, Event> | null {
    return this.#onopen;
  }

  public get readyState(): number {
    return this.#readyState;
  }

  public get url(): string {
    return this.#url;
  }

  public get withCredentials(): boolean {
    return this.#withCredentials;
  }

  public set onerror(handler: EventHandler<EventSource, Event> | null) {
    this.#onerror = handler;

    if (handler !== null) {
      this.#eventSourceEmitter.empty(EventSourceEmitter.errorEventType);
      this.#eventSourceEmitter.add(EventSourceEmitter.errorEventType, handler);
    }
  }

  public set onmessage(
    handler: EventHandler<EventSource, MessageEvent<unknown>> | null,
  ) {
    this.#onmessage = handler;

    if (handler !== null) {
      this.#eventSourceEmitter.empty('message');
      this.#eventSourceEmitter.add('message', handler);
    }
  }

  public set onopen(handler: EventHandler<EventSource, Event> | null) {
    this.#onopen = handler;

    if (handler !== null) {
      this.#eventSourceEmitter.empty(EventSourceEmitter.openEventType);
      this.#eventSourceEmitter.add(EventSourceEmitter.openEventType, handler);
    }
  }

  public addEventListener<T extends string>(
    type: T,
    handler:
      | (T extends NonMessageEvent
          ?
              | EventHandler<EventSource, Event>
              | EventHandlerObject<EventSource, Event>
          :
              | EventHandler<EventSource, MessageEvent<unknown>>
              | EventHandlerObject<EventSource, MessageEvent<unknown>>)
      | null,
    options?: AddEventListenerOptions | boolean,
  ): void {
    if (handler !== null) {
      if (typeof options !== 'boolean' && options?.once === true) {
        throw new Error('Unsupported "once" options');
      }

      this.#eventSourceEmitter.add(type, handler);
    }
  }

  public close(): void {
    this.#close();
  }

  public dispatchEvent(event: Event): boolean {
    this.#eventSourceEmitter.emit(event.type, event as MessageEvent);

    return !event.defaultPrevented;
  }

  public removeEventListener<T extends string>(
    type: T,
    handler:
      | (T extends NonMessageEvent
          ?
              | EventHandler<EventSource, Event>
              | EventHandlerObject<EventSource, Event>
          :
              | EventHandler<EventSource, MessageEvent<unknown>>
              | EventHandlerObject<EventSource, MessageEvent<unknown>>)
      | null,
    _options?: EventListenerOptions | boolean,
  ): void {
    if (handler !== null) {
      this.#eventSourceEmitter.remove(type, handler);
    }
  }

  protected _buildHeaders(): Headers {
    const headers: Headers = new Headers();
    headers.set('accept', EVENT_STREAM_MIME_TYPE);

    if (this.#lastEventId !== '') {
      headers.set('last-event-id', this.#lastEventId);
    }

    return headers;
  }

  // https://html.spec.whatwg.org/multipage/urls-and-fetching.html#create-a-potential-cors-request
  #buildPotentialCorsRequest(
    url: string,
    corsAtributeState: CorsSettingsAttribute,
    sameOriginFallback?: boolean,
  ): [Request, AbortController] {
    const abortController: AbortController = new AbortController();

    this.#currentAbortController = abortController;

    // 1. Let mode be "no-cors" if corsAttributeState is No CORS, and "cors" otherwise.
    let mode: RequestMode =
      corsAtributeState === 'No CORS' ? 'cors' : 'no-cors';

    // 2. If same-origin fallback flag is set and mode is "no-cors", set mode to "same-origin".
    if (sameOriginFallback === true && mode == 'no-cors') {
      mode = 'same-origin';
    }

    // 3. Let credentialsMode be "include".
    let credentialsMode: RequestCredentials = 'include';

    // 4. If corsAttributeState is Anonymous, set credentialsMode to "same-origin".
    if (corsAtributeState === 'Anonymous') {
      credentialsMode = 'same-origin';
    }

    /*
     * 5. Let request be a new request whose URL is url,
     *  destination is destination,
     *  mode is mode,
     *  credentials mode is credentialsMode,
     *  and whose use-URL-credentials flag is set.
     */

    const requestInit: RequestInit = {
      cache: 'no-store',
      credentials: credentialsMode,
      headers: this._buildHeaders(),
      mode,
      redirect: 'follow',
      signal: abortController.signal,
    };

    const request: Request = new Request(url, requestInit);

    // Cannot set request's initiator type to "other".
    return [request, abortController];
  }

  #close(): void {
    this.#readyState = this.CLOSED;

    if (this.#currentAbortController !== undefined) {
      this.#currentAbortController.abort();
    }

    this.dispatchEvent(new Event(EventSourceEmitter.errorEventType));
  }

  async #fetch(buildRequest: () => [Request, AbortController]): Promise<void> {
    await fetchSse({
      beforeRetry: (_error: unknown): boolean => {
        if (this.#readyState === this.CLOSED) {
          return false;
        }

        this.#readyState = this.CONNECTING;
        this.dispatchEvent(new Event(EventSourceEmitter.errorEventType));

        return true;
      },
      buildRequest,
      fail: async () => {
        this.#close();
      },
      getRetryMs: () => this.#retryMs,
      onOpen: () => {
        this.#readyState = this.OPEN;
        this.dispatchEvent(new Event(EventSourceEmitter.openEventType));
      },
      parseSseStreamParams: {
        onMessage: (messageEvent: MessageEvent<unknown>): void => {
          this.dispatchEvent(messageEvent);
        },
        onMessageId: (id: string): void => {
          this.#lastEventId = id;
        },
        onRetryMsChanged: (retryMs: number) => {
          this.#retryMs = retryMs;
        },
      },
    });
  }

  #getBaseUrl(): string | undefined {
    // Tricky way to avoid accessing window in order to avoid NodeJS error
    if (typeof window === 'undefined') {
      return undefined;
    }

    return window.location.href;
  }

  #parseUrl(url: string): string {
    try {
      return new URL(url, this.#getBaseUrl()).href;
    } catch (_error: unknown) {
      throw new DOMException(undefined, 'SyntaxError');
    }
  }
}
