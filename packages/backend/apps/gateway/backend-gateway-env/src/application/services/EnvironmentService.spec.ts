import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Environment } from '../models/Environment';
import { EnvironmentLoader } from './EnvironmentLoader';
import { EnvironmentService } from './EnvironmentService';

describe(EnvironmentService.name, () => {
  let environmentLoaderMock: jest.Mocked<EnvironmentLoader>;
  let environmentService: EnvironmentService;

  beforeAll(() => {
    environmentLoaderMock = {
      env: Symbol() as unknown as Environment,
    } as Partial<
      jest.Mocked<EnvironmentLoader>
    > as jest.Mocked<EnvironmentLoader>;

    environmentService = new EnvironmentService(environmentLoaderMock);
  });

  describe('.getEnvironment', () => {
    let result: unknown;

    beforeAll(() => {
      result = environmentService.getEnvironment();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return environmentLoaderMock.env', () => {
      expect(result).toBe(environmentLoaderMock.env);
    });
  });
});
