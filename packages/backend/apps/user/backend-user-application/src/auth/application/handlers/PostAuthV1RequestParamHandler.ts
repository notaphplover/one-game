import { models as apiModels, SchemaId } from '@cornie-js/api-models';
import { ApiJsonSchemasValidationProvider } from '@cornie-js/backend-api-validators';
import { Inject, Injectable } from '@nestjs/common';

import { RequestBodyParamHandler } from '../../../foundation/http/application/RequestBodyParamHandler';

@Injectable()
export class PostAuthV1RequestParamHandler extends RequestBodyParamHandler<apiModels.AuthCreateQueryV1> {
  constructor(
    @Inject(ApiJsonSchemasValidationProvider)
    apiJsonSchemasValidationProvider: ApiJsonSchemasValidationProvider,
  ) {
    super(apiJsonSchemasValidationProvider.provide(SchemaId.AuthCreateQueryV1));
  }
}
