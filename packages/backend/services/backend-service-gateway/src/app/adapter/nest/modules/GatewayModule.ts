import { ApplicationModule } from '@cornie-js/backend-gateway-application';
import { Module } from '@nestjs/common';

import { GraphqlModule } from '../../../../foundation/graphql/adapter/nest/modules/GraphqlModule';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';

@Module({
  exports: [ApplicationModule, GraphqlModule, HttpModule],
  imports: [ApplicationModule, GraphqlModule, HttpModule],
})
export class GatewayModule {}
