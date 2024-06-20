import { jest } from '@jest/globals';

import type { cornieApi as originalCornieApi } from '../cornieApi';

export const cornieApi: jest.Mocked<typeof originalCornieApi> = {
  useCreateAuthV2Mutation: jest.fn(),
  useCreateGamesV1Mutation: jest.fn(),
  useCreateGamesV1SlotsMutation: jest.fn(),
  useGetGamesV1MineQuery: jest.fn(),
  useGetUsersV1MeDetailQuery: jest.fn(),
  useGetUsersV1MeQuery: jest.fn(),
  useUpdateUsersV1MeMutation: jest.fn(),
} as Partial<jest.Mocked<typeof originalCornieApi>> as jest.Mocked<
  typeof originalCornieApi
>;
