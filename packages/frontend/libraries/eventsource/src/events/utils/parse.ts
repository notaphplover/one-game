type MessageEventField = 'event' | 'data' | 'id' | 'retry';

interface MessageEventFieldTypesMap {
  event: string;
  data: string;
  id: string;
  retry: number;
}

type MessageEventFieldMap = {
  [TKey in MessageEventField]?: MessageEventFieldTypesMap[TKey];
};

export interface ParseSseStreamParams {
  onMessage: (messageEvent: MessageEvent<unknown>) => void;
  onMessageId: (id: string) => void;
  onRetryMsChanged: (retry: number) => void;
}

const LINE_REGEX: RegExp =
  /^(?:(data|event|id|retry)(?::\s?(.*))?)?(?:\n|\r|\r\n)/gm;
const FIELD_NAME_GROUP: number = 1;
const FIELD_CONTENT_GROUP: number = 2;

const LINE_FEED: string = '\n';

const SLICE_LAST_CHARACTER_START: number | undefined = 0;
const SLICE_LAST_CHARACTER_END: number | undefined = -1;

const textDecoder: TextDecoder = new TextDecoder(undefined, {
  ignoreBOM: false,
});

export async function parse(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  params: ParseSseStreamParams,
): Promise<void> {
  let currentData: string = '';

  const messageEventFields: MessageEventFieldMap = {};

  await getBytes(reader, (chunk: Uint8Array): void => {
    currentData += textDecoder.decode(chunk);

    const matches: RegExpMatchArray[] = [...currentData.matchAll(LINE_REGEX)];

    if (matches.length > 0) {
      parseLineMatches(matches, messageEventFields, params);

      const lastMatch: RegExpMatchArray = matches[
        matches.length - 1
      ] as RegExpMatchArray;

      const lastIndex: number = lastMatch.index as number;

      currentData = currentData.slice(lastIndex + lastMatch.length);
    }
  });
}

// https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation

function buildMessageEvent(
  messageEventFields: MessageEventFieldMap,
  params: ParseSseStreamParams,
): MessageEvent | undefined {
  const messageEventInit: MessageEventInit<unknown> = {};

  if (messageEventFields.data !== undefined) {
    let data: string = messageEventFields.data;

    if (data === '') {
      return undefined;
    }

    if (data.endsWith(LINE_FEED)) {
      data = copyWithoutLastCharacter(data);
    }

    messageEventInit.data = data;
  }

  if (messageEventFields.id !== undefined) {
    params.onMessageId(messageEventFields.id);

    messageEventInit.lastEventId = messageEventFields.id;
  }

  const messageEvent: MessageEvent<unknown> = new MessageEvent(
    messageEventFields.event ?? 'message',
    messageEventInit,
  );

  return messageEvent;
}

function emptyFields(messageEventFields: MessageEventFieldMap): void {
  delete messageEventFields.data;
  delete messageEventFields.event;
  delete messageEventFields.id;
  delete messageEventFields.retry;
}

function copyWithoutLastCharacter(text: string): string {
  return text.slice(SLICE_LAST_CHARACTER_START, SLICE_LAST_CHARACTER_END);
}

async function getBytes(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunk: (chunk: Uint8Array) => void,
) {
  let result: ReadableStreamReadResult<Uint8Array>;
  while (!(result = await reader.read()).done) {
    onChunk(result.value);
  }
}

function parseLineMatches(
  matches: RegExpMatchArray[],
  messageEventFields: MessageEventFieldMap,
  params: ParseSseStreamParams,
): void {
  for (const match of matches) {
    const name: string | undefined = match[FIELD_NAME_GROUP];
    const content: string | undefined = match[FIELD_CONTENT_GROUP];

    if (name === undefined) {
      const messageEvent: MessageEvent | undefined = buildMessageEvent(
        messageEventFields,
        params,
      );

      if (messageEvent !== undefined) {
        params.onMessage(messageEvent);
      }

      emptyFields(messageEventFields);
    } else {
      setMessageEventField(
        messageEventFields,
        params.onRetryMsChanged,
        name as MessageEventField,
        content,
      );
    }
  }
}

function setMessageEventField(
  messageEventFields: MessageEventFieldMap,
  onRetryChanged: (retry: number) => void,
  fieldName: MessageEventField,
  content: string | undefined,
): void {
  switch (fieldName) {
    case 'data':
      messageEventFields.data =
        messageEventFields.data ?? '' + content ?? '' + LINE_FEED;
      break;
    case 'event':
      messageEventFields.event = content ?? '';
      break;
    case 'id':
      messageEventFields.id = content ?? '';
      break;
    case 'retry':
      {
        const retry: number = parseInt(content ?? '');

        if (!Number.isNaN(retry) && retry >= 0) {
          onRetryChanged(retry);
        }
      }
      break;
  }
}
