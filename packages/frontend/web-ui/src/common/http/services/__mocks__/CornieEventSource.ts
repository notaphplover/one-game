import { jest } from '@jest/globals';

import { EventSource } from '@cornie-js/eventsource';

export const CornieEventSource: jest.Mock<(this: EventSource) => void> = jest
  .fn()
  .mockImplementation(function (this: EventSource) {
    this.addEventListener = jest.fn();
  });
