import { models as apiModels, SchemaId } from '@cornie-js/api-models';
import { ApiJsonSchemasValidationProvider } from '@cornie-js/backend-api-validators';
import { Inject, Injectable } from '@nestjs/common';

import { RequestBodyParamHandler } from '../../../foundation/http/application/RequestBodyParamHandler';

@Injectable()
export class PostAuthV2RequestBodyParamHandler extends RequestBodyParamHandler<apiModels.AuthCreateQueryV2> {
  constructor(
    @Inject(ApiJsonSchemasValidationProvider)
    apiJsonSchemasValidationProvider: ApiJsonSchemasValidationProvider,
  ) {
    super(apiJsonSchemasValidationProvider.provide(SchemaId.AuthCreateQueryV2));
  }
}
