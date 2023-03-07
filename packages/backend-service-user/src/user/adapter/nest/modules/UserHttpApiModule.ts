import { Module } from '@nestjs/common';

import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { PostUserV1RequestParamHandler } from '../../../application/handlers/PostUserV1RequestParamHandler';

@Module({
  imports: [JsonSchemaModule],
  providers: [PostUserV1RequestParamHandler],
})
export class UserHttpApiModule {}
