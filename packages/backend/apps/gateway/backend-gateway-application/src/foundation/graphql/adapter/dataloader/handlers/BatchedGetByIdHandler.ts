import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import DataLoader from 'dataloader';

export abstract class BatchedGetByIdHandler<TId, TInput, TOutput>
  implements Handler<[TId], TOutput | undefined>
{
  readonly #dataLoader: DataLoader<TId, TInput | undefined>;

  constructor(options?: DataLoader.Options<TId, TInput | undefined>) {
    this.#dataLoader = new DataLoader(
      this.#getEntitiesOrErrorsByIds.bind(this),
      options,
    );
  }

  public async handle(id: TId): Promise<TOutput | undefined> {
    const input: TInput | undefined = await this.#dataLoader.load(id);

    if (input === undefined) {
      return undefined;
    } else {
      return this._buildOutput(input);
    }
  }

  #getInputsOrErrors(
    ids: readonly TId[],
    entities: TInput[],
  ): (TInput | undefined | Error)[] {
    let offsetCounter: number = 0;
    const inputsOrErrors: (TInput | undefined | Error)[] = [];

    for (let i: number = 0; i < entities.length; ++i) {
      const ithEntity: TInput = entities[i] as TInput;
      const ithEntityId: TId = this._getId(ithEntity);

      let currentIndex: TId | undefined = ids[i + offsetCounter];

      while (ithEntityId !== currentIndex) {
        if (currentIndex === undefined) {
          throw new AppError(
            AppErrorKind.unknown,
            'Unable to fetch entities. Unexpected undefined id',
          );
        }

        currentIndex = ids[i + ++offsetCounter];

        inputsOrErrors.push(undefined);
      }

      inputsOrErrors.push(ithEntity);
    }

    while (inputsOrErrors.length < ids.length) {
      inputsOrErrors.push(undefined);
    }

    return inputsOrErrors;
  }

  async #getEntitiesOrErrorsByIds(
    ids: readonly TId[],
  ): Promise<(TInput | undefined | Error)[]> {
    const entities: TInput[] = await this._getByIds(ids);

    if (entities.length === ids.length) {
      return entities;
    }

    return this.#getInputsOrErrors(ids, entities);
  }

  protected abstract _buildOutput(input: TInput): TOutput;
  protected abstract _getByIds(ids: readonly TId[]): Promise<TInput[]>;
  protected abstract _getId(input: TInput): TId;
}
