import { Inject, Injectable } from '@nestjs/common';

import { Environment } from '../models/application/Environment';
import { EnvironmentLoader } from './EnvironmentLoader';

@Injectable()
export class EnvironmentService {
  readonly #environmentLoader: EnvironmentLoader;

  constructor(
    @Inject(EnvironmentLoader)
    environmentLoader: EnvironmentLoader,
  ) {
    this.#environmentLoader = environmentLoader;
  }

  public getEnvironment(): Environment {
    return this.#environmentLoader.env;
  }
}
