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
export class PostAuthV1RequestParamHandler
  implements Handler<[RequestWithBody], [apiModels.AuthCreateQueryV1]>
{
  readonly #userCreateQueryV1Validator: Validator<apiModels.AuthCreateQueryV1>;

  constructor(
    @Inject(ApiJsonSchemasValidationProvider)
    apiJsonSchemasValidationProvider: ApiJsonSchemasValidationProvider,
  ) {
    this.#userCreateQueryV1Validator = apiJsonSchemasValidationProvider.provide(
      SchemaId.AuthCreateQueryV1,
    );
  }

  public async handle(
    request: RequestWithBody,
  ): Promise<[apiModels.AuthCreateQueryV1]> {
    const errorObject: ValidationErrorObject = {
      error: undefined,
    };

    if (this.#isAuthCreateQueryV1(request.body, errorObject)) {
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

  #isAuthCreateQueryV1(
    input: unknown,
    errorObject: ValidationErrorObject,
  ): input is apiModels.AuthCreateQueryV1 {
    const validationResult: boolean =
      this.#userCreateQueryV1Validator.validate(input);

    if (!validationResult && this.#userCreateQueryV1Validator.errors != null) {
      errorObject.error = this.#userCreateQueryV1Validator.errors;
    }

    return validationResult;
  }
}
