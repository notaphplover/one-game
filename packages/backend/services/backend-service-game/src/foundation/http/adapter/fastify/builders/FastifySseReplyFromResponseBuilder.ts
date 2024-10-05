import { EnvironmentService } from '@cornie-js/backend-app-game-env';
import { FastifySseReplyFromResponseBuilder as BaseFastifySseReplyFromResponseBuilder } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FastifySseReplyFromResponseBuilder extends BaseFastifySseReplyFromResponseBuilder {
  constructor(
    @Inject(EnvironmentService)
    environmentService: EnvironmentService,
  ) {
    super(environmentService.getEnvironment().corsOrigins);
  }
}
