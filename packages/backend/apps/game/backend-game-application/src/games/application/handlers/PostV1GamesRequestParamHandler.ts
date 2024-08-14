import { models as apiModels, SchemaId } from '@cornie-js/api-models';
import { ApiJsonSchemasValidationProvider } from '@cornie-js/backend-api-validators';
import { Handler } from '@cornie-js/backend-common';
import { RequestWithBody } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { RequestBodyParamHandler } from '../../../foundation/http/application/RequestBodyParamHandler';

@Injectable()
export class PostV1GamesRequestParamHandler
  extends RequestBodyParamHandler<apiModels.GameCreateQueryV1>
  implements Handler<[RequestWithBody], [apiModels.GameCreateQueryV1]>
{
  constructor(
    @Inject(ApiJsonSchemasValidationProvider)
    apiJsonSchemasValidationProvider: ApiJsonSchemasValidationProvider,
  ) {
    super(apiJsonSchemasValidationProvider.provide(SchemaId.GameCreateQueryV1));
  }
}
