import { ApplicationModule } from '@cornie-js/backend-gateway-application';
import { Module } from '@nestjs/common';

import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';

@Module({
  exports: [ApplicationModule, HttpModule],
  imports: [ApplicationModule, HttpModule],
})
export class GatewayModule {}
