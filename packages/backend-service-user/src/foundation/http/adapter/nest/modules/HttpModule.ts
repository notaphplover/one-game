import { Module } from '@nestjs/common';
import { SingleEntityPostResponseBuilder } from '@one-game-js/backend-http';

@Module({
  exports: [SingleEntityPostResponseBuilder],
  providers: [SingleEntityPostResponseBuilder],
})
export class HttpModule {}
