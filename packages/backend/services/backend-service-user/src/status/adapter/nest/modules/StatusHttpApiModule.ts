import { Module } from '@nestjs/common';

import { GetV1ReadyHttpRequestNestController } from '../controllers/GetV1ReadyHttpRequestNestController';

@Module({
  controllers: [GetV1ReadyHttpRequestNestController],
})
export class StatusHttpApiModule {}
