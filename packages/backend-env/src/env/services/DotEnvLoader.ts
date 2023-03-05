import dotenv from 'dotenv';

export abstract class DotEnvLoader<TEnv extends Record<string, unknown>> {
  #env: TEnv | undefined;
  readonly #path: string;

  constructor(path: string) {
    this.#env = undefined;
    this.#path = path;
  }

  public get index(): TEnv {
    return this.#env ?? this.#load();
  }

  public load(): void {
    this.#load();
  }

  #load(): TEnv {
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

    const env: TEnv = this._parseEnv(result.parsed);

    this.#env = env;

    return env;
  }

  protected abstract _parseEnv(env: Record<string, string>): TEnv;
}
