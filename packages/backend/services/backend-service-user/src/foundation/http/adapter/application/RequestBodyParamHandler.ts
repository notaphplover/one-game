import { models as apiModels } from '@cornie-js/api-models';
import { Validator } from '@cornie-js/backend-api-validators';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import { RequestWithBody } from '@cornie-js/backend-http';

interface ValidationErrorObject {
  error: string | undefined;
}

const MISSING_ERROR_DESCRIPTION_DESCRIPTION: string =
  'Missing validation error description!';

export class RequestBodyParamHandler<TApiQuery>
  implements Handler<[RequestWithBody], [TApiQuery]>
{
  readonly #apiBodyValidator: Validator<TApiQuery>;

  constructor(apiBodyValidator: Validator<TApiQuery>) {
    this.#apiBodyValidator = apiBodyValidator;
  }

  public async handle(request: RequestWithBody): Promise<[TApiQuery]> {
    const errorObject: ValidationErrorObject = {
      error: undefined,
    };

    if (this.#isApiQuery(request.body, errorObject)) {
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

  #isApiQuery(
    input: unknown,
    errorObject: ValidationErrorObject,
  ): input is TApiQuery {
    const validationResult: boolean = this.#apiBodyValidator.validate(input);

    if (!validationResult && this.#apiBodyValidator.errors != null) {
      errorObject.error = this.#apiBodyValidator.errors;
    }

    return validationResult;
  }
}
