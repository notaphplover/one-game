import { jest } from '@jest/globals';

import { Environment } from '../../models/Environment';
import type { EnvironmentService as OriginalEnvironmentService } from '../EnvironmentService';

export const environmentService: Partial<OriginalEnvironmentService> = {
  getEnvironment: jest.fn<() => Environment>(),
};
