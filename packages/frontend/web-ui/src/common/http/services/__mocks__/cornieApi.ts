import { jest } from '@jest/globals';

import type { cornieApi as originalCornieApi } from '../cornieApi';

export const cornieApi: jest.Mocked<typeof originalCornieApi> = {
  useCreateAuthV2Mutation: jest.fn(),
  useGetGamesV1MineQuery: jest.fn(),
} as Partial<jest.Mocked<typeof originalCornieApi>> as jest.Mocked<
  typeof originalCornieApi
>;
