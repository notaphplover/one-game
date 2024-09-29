import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import http from 'node:http';

import express from 'express';

import { EventHandler } from '../handlers/EventHandler';
import { EventSource } from './EventSource';
import { EventSourceEmitter } from './EventSourceEmitter';

const PORT: number = 13654;

describe(EventSource.name, () => {
  let app: express.Express;
  let server: http.Server;

  beforeAll(async () => {
    app = express();

    function countdown(response: express.Response, count: number) {
      response.write('id: ' + count + '\n' + 'data: ' + count + '\n\n');
      if (count > 0) {
        setTimeout(() => countdown(response, count - 1), 10);
      } else {
        response.end();
      }
    }

    app.get(
      '/sse',
      function (_request: express.Request, response: express.Response) {
        response.writeHead(200, {
          'cache-control':
            'private, no-cache, no-store, must-revalidate, max-age=0, no-transform',
          connection: 'keep-alive',
          'content-type': 'text/event-stream',
          expire: '0',
          pragma: 'no-cache',
          'x-accel-buffering': 'no',
        });

        countdown(response, 2);
      },
    );

    await new Promise<void>((resolve: () => void) => {
      server = app.listen(PORT, '0.0.0.0', resolve);
    });
  });

  afterAll(async () => {
    await new Promise<void>(
      (resolve: () => void, reject: (reason: unknown) => void) => {
        server.close((error: Error | undefined) => {
          if (error === undefined) {
            resolve();
          } else {
            reject(error);
          }
        });
      },
    );
  });

  describe('.onmessage', () => {
    describe('when called, and messages are received', () => {
      let onMessageMock: jest.Mock<
        EventHandler<EventSource, MessageEvent<unknown>>
      >;
      let eventSource: EventSource;

      beforeAll(async () => {
        eventSource = new EventSource(
          `http://localhost:${PORT.toString()}/sse`,
        );

        await new Promise<void>((resolve: () => void) => {
          onMessageMock = jest
            .fn<EventHandler<EventSource, MessageEvent<unknown>>>()
            .mockImplementation((_event: MessageEvent<unknown>): void => {
              if (onMessageMock.mock.calls.length === 6) {
                eventSource.close();
                resolve();
              }
            });

          eventSource.onmessage = onMessageMock;
        });
      });

      it('should call onmessage()', () => {
        const expectedMessageEventProperties: Partial<MessageEvent<unknown>>[] =
          [
            {
              data: '2',
              lastEventId: '2',
            },
            {
              data: '1',
              lastEventId: '1',
            },
            {
              data: '0',
              lastEventId: '0',
            },
            {
              data: '2',
              lastEventId: '2',
            },
            {
              data: '1',
              lastEventId: '1',
            },
            {
              data: '0',
              lastEventId: '0',
            },
          ];

        expect(onMessageMock).toHaveBeenCalledTimes(6);

        for (
          let i: number = 0;
          i < expectedMessageEventProperties.length;
          ++i
        ) {
          expect(onMessageMock).toHaveBeenNthCalledWith(
            i + 1,
            expect.objectContaining(
              expectedMessageEventProperties[i] as Partial<
                MessageEvent<unknown>
              >,
            ),
          );
        }
      });
    });
  });

  describe('.onopen', () => {
    describe('when called, and conection is opened', () => {
      let onOpenMock: EventHandler<EventSource, Event>;
      let eventSource: EventSource;

      beforeAll(async () => {
        eventSource = new EventSource(
          `http://localhost:${PORT.toString()}/sse`,
        );

        await new Promise<void>((resolve: () => void) => {
          onOpenMock = jest
            .fn<EventHandler<EventSource, Event>>()
            .mockImplementation((_event: Event): void => {
              eventSource.close();
              resolve();
            });

          eventSource.onopen = onOpenMock;
        });
      });

      it('should call onopen()', () => {
        const expectedProperties: Partial<Event> = {
          type: EventSourceEmitter.openEventType,
        };

        expect(onOpenMock).toHaveBeenCalledTimes(1);
        expect(onOpenMock).toHaveBeenCalledWith(
          expect.objectContaining(expectedProperties),
        );
      });
    });
  });
});
