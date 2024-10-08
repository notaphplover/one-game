import { parse, ParseSseStreamParams } from './parse';

const HTTP_STATUS_OK: number = 200;
const EVENT_STREAM_MIME_TYPE: string = 'text/event-stream';

export interface FetchSseParams {
  beforeRetry: (error: unknown) => boolean;
  buildRequest: () => [Request, AbortController];
  fail: (error: unknown) => Promise<void>;
  getRetryMs: () => number;
  onOpen: () => void;
  parseSseStreamParams: ParseSseStreamParams;
}

interface GenericFetchSseParams {
  buildRequest: () => [Request, AbortController];
  fail: (error: unknown) => Promise<void>;
  onConnectionLost: (error: unknown) => Promise<void>;
  onOpen: () => void;
  onRequestFail: (error: unknown) => Promise<void>;
  parseSseStreamParams: ParseSseStreamParams;
}

export async function fetchSse(params: FetchSseParams): Promise<void> {
  const retry: (error: unknown) => Promise<void> = async (error: unknown) =>
    new Promise<void>((resolve: (value: void | Promise<void>) => void) => {
      setTimeout(() => {
        if (params.beforeRetry(error)) {
          resolve(
            genericFetchSse({
              buildRequest: params.buildRequest,
              fail: params.fail,
              onConnectionLost: retry,
              onOpen: params.onOpen,
              onRequestFail: params.fail,
              parseSseStreamParams: params.parseSseStreamParams,
            }),
          );
        } else {
          resolve();
        }
      }, params.getRetryMs());
    });

  return genericFetchSse({
    buildRequest: params.buildRequest,
    fail: params.fail,
    onConnectionLost: retry,
    onOpen: params.onOpen,
    onRequestFail: retry,
    parseSseStreamParams: params.parseSseStreamParams,
  });
}

async function genericFetchSse(params: GenericFetchSseParams): Promise<void> {
  const [request, abortController]: [Request, AbortController] =
    params.buildRequest();
  let response: Response;

  try {
    response = await fetch(request);
  } catch (error: unknown) {
    abortController.abort(error);
    return params.onRequestFail(error);
  }

  if (isNetworkError(response)) {
    return params.onRequestFail(new Error('Network error'));
  }

  if (
    response.status !== HTTP_STATUS_OK ||
    response.headers.get('content-type') !== EVENT_STREAM_MIME_TYPE
  ) {
    return params.fail(
      new Error(
        `Unexpected response. Expecting a "${HTTP_STATUS_OK.toString()}" "${EVENT_STREAM_MIME_TYPE}" response`,
      ),
    );
  }

  if (response.body == null) {
    return params.onRequestFail(
      new Error('Expecing a response with a body, none found'),
    );
  }

  params.onOpen();

  const reader: ReadableStreamDefaultReader<Uint8Array> =
    response.body.getReader();

  try {
    await parse(reader, params.parseSseStreamParams);
    throw new Error('Connection ended');
  } catch (error: unknown) {
    abortController.abort(error);
    return params.onConnectionLost(error);
  }
}

function isNetworkError(response: Response): boolean {
  return response.type === 'error' && response.status === 0;
}
