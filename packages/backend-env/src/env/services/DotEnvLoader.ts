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
    dotenv.config({
      path: this.#path,
    });

    const env: TEnv = this.parseIndex();

    this.#env = env;

    return env;
  }

  protected abstract parseIndex(): TEnv;
}
