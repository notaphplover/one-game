import { jest } from '@jest/globals';

import type { store as originalStore } from '../store';

export const store: Partial<jest.Mocked<typeof originalStore>> = {
  dispatch: jest.fn() as unknown,
  getState: jest.fn(),
  subscribe: jest.fn(),
} as Partial<jest.Mocked<typeof originalStore>>;
