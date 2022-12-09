import {
  JsonRootSchema202012,
  JsonRootSchema202012Object,
} from '@one-game-js/json-schema-utils';
import Ajv, { ErrorObject, ValidateFunction } from 'ajv/dist/2020';

import { Validator } from '../../../../common/application/modules/Validator';
import { ValidatorProvider } from '../../../../common/application/modules/ValidatorProvider';

export class AjvJsonSchemaValidatorProvider<TId extends string = string>
  implements ValidatorProvider<TId>
{
  readonly #idToValidatorMap: Map<string, Validator<unknown>>;
  readonly #ajvInstance: Ajv;
  #initializeIsCalled: boolean;
  readonly #jsonSchemas: JsonRootSchema202012Object[];

  constructor(jsonSchemas: JsonRootSchema202012[]) {
    this.#idToValidatorMap = new Map();
    this.#ajvInstance = new Ajv();
    this.#initializeIsCalled = false;

    this.#validateJsonSchemas(jsonSchemas);
    this.#jsonSchemas = jsonSchemas as JsonRootSchema202012Object[];
  }

  public provide<T>(id: TId): Validator<T> {
    const validator: Validator<unknown> | undefined =
      this.#idToValidatorMap.get(id);

    if (validator === undefined) {
      throw new Error(`No validator found for id "${id}"`);
    }

    return validator as Validator<T>;
  }

  public async initialize(): Promise<void> {
    this.#registerInitializeCall();

    this.#initializeValidatorMap();
  }

  #buildValidator(ajvValidateFn: ValidateFunction): Validator<unknown> {
    const validator: Validator<unknown> = {
      validate: (data: unknown): data is unknown => {
        const validationResult: boolean = ajvValidateFn(data);

        if (validationResult) {
          validator.errors = null;
        } else {
          validator.errors = (ajvValidateFn.errors ?? [])
            .map((errorObject: ErrorObject) => errorObject.message ?? '')
            .join('\n');
        }

        return validationResult;
      },
    };

    return validator;
  }

  #initializeValidatorMap(): void {
    for (const jsonSchema of this.#jsonSchemas) {
      const jsonSchemaId: string = jsonSchema.$id as string;
      this.#ajvInstance.addSchema(jsonSchema, jsonSchemaId);
    }

    for (const jsonSchema of this.#jsonSchemas) {
      const ajvValidateFn: ValidateFunction =
        this.#ajvInstance.compile(jsonSchema);

      const validator: Validator<unknown> = this.#buildValidator(ajvValidateFn);
      const jsonSchemaId: string = jsonSchema.$id as string;

      this.#idToValidatorMap.set(jsonSchemaId, validator);
    }
  }

  #registerInitializeCall(): void {
    if (this.#initializeIsCalled) {
      throw new Error('Initialize was already called!');
    } else {
      this.#initializeIsCalled = true;
    }
  }

  #throwOnNonJsonSchemaWith$Id(jsonSchema: JsonRootSchema202012): void {
    if (typeof jsonSchema === 'boolean') {
      throw new Error(`Unexpected boolean JsonSchema`);
    }

    if (jsonSchema.$id === undefined) {
      throw new Error(
        `Unexpected JsonSchema object without $id.

${JSON.stringify(jsonSchema)}`,
      );
    }
  }

  #validateJsonSchemas(jsonSchemas: JsonRootSchema202012[]): void {
    for (const jsonSchema of jsonSchemas) {
      this.#throwOnNonJsonSchemaWith$Id(jsonSchema);
    }
  }
}
