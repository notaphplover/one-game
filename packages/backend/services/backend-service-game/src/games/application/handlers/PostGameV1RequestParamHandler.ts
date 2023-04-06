import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels, SchemaId } from '@one-game-js/api-models';
import {
  ApiJsonSchemasValidationProvider,
  Validator,
} from '@one-game-js/backend-api-validators';
import { AppError, AppErrorKind, Handler } from '@one-game-js/backend-common';
import { RequestWithBody } from '@one-game-js/backend-http';

interface ValidationErrorObject {
  error: string | undefined;
}

const MISSING_ERROR_DESCRIPTION_DESCRIPTION: string =
  'Missing validation error description!';

@Injectable()
export class PostGameV1RequestParamHandler
  implements Handler<[RequestWithBody], [apiModels.GameCreateQueryV1]>
{
  readonly #gameCreateQueryV1Validator: Validator<apiModels.GameCreateQueryV1>;

  constructor(
    @Inject(ApiJsonSchemasValidationProvider)
    apiJsonSchemasValidationProvider: ApiJsonSchemasValidationProvider,
  ) {
    this.#gameCreateQueryV1Validator = apiJsonSchemasValidationProvider.provide(
      SchemaId.GameCreateQueryV1,
    );
  }

  public async handle(
    request: RequestWithBody,
  ): Promise<[apiModels.GameCreateQueryV1]> {
    const errorObject: ValidationErrorObject = {
      error: undefined,
    };

    if (this.#isGameCreateQueryV1(request.body, errorObject)) {
      return [request.body];
    } else {
      const errorV1: apiModels.ErrorV1 = {
        description: errorObject.error ?? MISSING_ERROR_DESCRIPTION_DESCRIPTION,
      };

      throw new AppError(
        AppErrorKind.contractViolation,
        JSON.stringify(errorV1),
      );
    }
  }

  #isGameCreateQueryV1(
    input: unknown,
    errorObject: ValidationErrorObject,
  ): input is apiModels.GameCreateQueryV1 {
    const validationResult: boolean =
      this.#gameCreateQueryV1Validator.validate(input);

    if (!validationResult && this.#gameCreateQueryV1Validator.errors != null) {
      errorObject.error = this.#gameCreateQueryV1Validator.errors;
    }

    return validationResult;
  }
}
