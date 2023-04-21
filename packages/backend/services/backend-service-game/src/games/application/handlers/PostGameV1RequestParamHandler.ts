import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels, SchemaId } from '@one-game-js/api-models';
import { ApiJsonSchemasValidationProvider } from '@one-game-js/backend-api-validators';
import { Handler } from '@one-game-js/backend-common';
import { RequestWithBody } from '@one-game-js/backend-http';

import { RequestBodyParamHandler } from '../../../foundation/http/application/RequestBodyParamHandler';

@Injectable()
export class PostGameV1RequestParamHandler
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
