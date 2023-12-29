import process from 'node:process';

import dotenv from 'dotenv';

export abstract class DotEnvLoader<TEnv> {
  #env: TEnv | undefined;
  readonly #path: string;

  constructor(path: string) {
    this.#env = undefined;
    this.#path = path;
  }

  public get env(): TEnv {
    return this.#env ?? this.#load();
  }

  public load(): void {
    this.#load();
  }

  #fetchEnv(): Record<string, string | undefined> {
    if (!this._shouldParseEnvFile()) {
      return process.env;
    }

    const result: dotenv.DotenvConfigOutput = dotenv.config({
      path: this.#path,
    });

    if (result.parsed === undefined) {
      if (result.error === undefined) {
        throw new Error('Expected an error or a parse result');
      } else {
        throw result.error;
      }
    }

    return result.parsed;
  }

  #load(): TEnv {
    const env: TEnv = this._parseEnv(this.#fetchEnv());

    this.#env = env;

    return env;
  }

  protected abstract _parseEnv(env: Record<string, string | undefined>): TEnv;

  protected abstract _shouldParseEnvFile(): boolean;
}
