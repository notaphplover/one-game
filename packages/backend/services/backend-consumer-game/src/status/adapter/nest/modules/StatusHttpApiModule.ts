import { Module } from '@nestjs/common';

import { GetReadyV1HttpRequestNestController } from '../controllers/GetReadyV1HttpRequestNestController';

@Module({
  controllers: [GetReadyV1HttpRequestNestController],
})
export class StatusHttpApiModule {}
