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
export class PostUserV1RequestParamHandler
  implements Handler<[RequestWithBody], [apiModels.UserCreateQueryV1]>
{
  readonly #userCreateQueryV1Validator: Validator<apiModels.UserCreateQueryV1>;

  constructor(
    @Inject(ApiJsonSchemasValidationProvider)
    apiJsonSchemasValidationProvider: ApiJsonSchemasValidationProvider,
  ) {
    this.#userCreateQueryV1Validator = apiJsonSchemasValidationProvider.provide(
      SchemaId.UserCreateQueryV1,
    );
  }

  public async handle(
    request: RequestWithBody,
  ): Promise<[apiModels.UserCreateQueryV1]> {
    const errorObject: ValidationErrorObject = {
      error: undefined,
    };

    if (this.#isUserCreateQueryV1(request.body, errorObject)) {
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

  #isUserCreateQueryV1(
    input: unknown,
    errorObject: ValidationErrorObject,
  ): input is apiModels.UserCreateQueryV1 {
    const validationResult: boolean =
      this.#userCreateQueryV1Validator.validate(input);

    if (!validationResult && this.#userCreateQueryV1Validator.errors != null) {
      errorObject.error = this.#userCreateQueryV1Validator.errors;
    }

    return validationResult;
  }
}
