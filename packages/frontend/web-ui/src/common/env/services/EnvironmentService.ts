import { Environment } from '../models/Environment';

export class EnvironmentService {
  readonly #env: Environment;

  constructor() {
    this.#env = this.#parseEnv();
  }

  public getEnvironment(): Environment {
    return this.#env;
  }

  #parseEnv(): Environment {
    const env: ImportMetaEnv = import.meta.env;

    const backendBaseUrl: unknown = env['VITE_BACKEND_BASE_URL'];

    if (typeof backendBaseUrl !== 'string') {
      throw new Error('Invalid backendBaseUrl found when parsing env');
    }

    return {
      backendBaseUrl: backendBaseUrl,
    };
  }
}

export const environmentService = new EnvironmentService();
