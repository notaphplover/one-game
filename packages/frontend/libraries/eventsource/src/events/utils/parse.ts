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

const LINE_REGEX: RegExp =
  /^(?:(data|event|id|retry)(?::\s?(.*))?)?(?:\n|\r|\r\n)/gm;
const FIELD_NAME_GROUP: number = 1;
const FIELD_CONTENT_GROUP: number = 2;

const textDecoder: TextDecoder = new TextDecoder(undefined, {
  ignoreBOM: false,
});

export async function parse(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onMessage: (messageEvent: MessageEvent<unknown>) => void,
  onRetryChanged: (retry: number) => void,
): Promise<void> {
  let currentData: string = '';

  const messageEventFields: MessageEventFieldMap = {};

  await getBytes(reader, (chunk: Uint8Array): void => {
    currentData += textDecoder.decode(chunk);

    const matches: RegExpMatchArray[] = [...currentData.matchAll(LINE_REGEX)];

    if (matches.length > 0) {
      parseLineMatches(matches, messageEventFields, onMessage, onRetryChanged);

      const lastMatch: RegExpMatchArray = matches[
        matches.length - 1
      ] as RegExpMatchArray;

      const lastIndex: number = lastMatch.index as number;

      currentData = currentData.slice(lastIndex + lastMatch.length);
    }
  });
}

function buildMessageEvent(
  messageEventFields: MessageEventFieldMap,
): MessageEvent {
  const messageEventInit: MessageEventInit<unknown> = {};

  if (messageEventFields.data !== undefined) {
    messageEventInit.data = messageEventFields.data;
  }

  if (messageEventFields.id !== undefined) {
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
  onMessage: (messageEvent: MessageEvent<unknown>) => void,
  onRetryChanged: (retry: number) => void,
): void {
  for (const match of matches) {
    const name: string | undefined = match[FIELD_NAME_GROUP];
    const content: string | undefined = match[FIELD_CONTENT_GROUP];

    if (name === undefined) {
      onMessage(buildMessageEvent(messageEventFields));
      emptyFields(messageEventFields);
    } else {
      setMessageEventField(
        messageEventFields,
        onRetryChanged,
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
      messageEventFields.data = messageEventFields.data ?? '' + content ?? '';
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

        if (!Number.isNaN(retry)) {
          onRetryChanged(retry);
        }
      }
      break;
  }
}
