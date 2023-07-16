import { SchemaId, models as apiModels } from '@cornie-js/api-models';
import { ApiJsonSchemasValidationProvider } from '@cornie-js/backend-api-validators';
import { Inject, Injectable } from '@nestjs/common';

import { RequestBodyParamHandler } from '../../../foundation/http/application/RequestBodyParamHandler';

@Injectable()
export class PatchUserV1MeRequestBodyParamHandler extends RequestBodyParamHandler<apiModels.UserMeUpdateQueryV1> {
  constructor(
    @Inject(ApiJsonSchemasValidationProvider)
    apiJsonSchemasValidationProvider: ApiJsonSchemasValidationProvider,
  ) {
    super(
      apiJsonSchemasValidationProvider.provide(SchemaId.UserMeUpdateQueryV1),
    );
  }
}
